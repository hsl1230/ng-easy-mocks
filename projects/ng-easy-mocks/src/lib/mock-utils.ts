import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import 'reflect-metadata';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { DebugElement, InjectFlags, InjectionToken, Type } from '@angular/core';
import { mock, instance } from 'ts-mockito';

const ENTRY_COMPONENT_TYPE_METADATA = 'test:entryComponentType';
const MOCK_COMPONENTS_METADATA = 'test:mockComponents';
const DECLARATIONS_METADATA = 'test:declarations';
const IMPORTS_METADATA = 'test:imports';
const PROVIDERS_METADATA = 'test:providers';
const MOCK_SERVICES_METADATA = 'test:mockServices';

export interface ServiceMetadata<T> {
  instance?: T;
  serviceMock: T;
}

export function ComponentTest<T>(metadata: Type<T>) {
  return (target: any) => { // class constructor
    target.prototype.ngOnDestroy = () => {
      Reflect.deleteMetadata(ENTRY_COMPONENT_TYPE_METADATA, target);
    };
    Reflect.defineMetadata(ENTRY_COMPONENT_TYPE_METADATA, metadata, target);
  };
}

export function MockComponents(metadata: Array<any>) {
  return (target: any) => { // class constructor
    if (Reflect.hasMetadata(MOCK_COMPONENTS_METADATA, target)) {
      Reflect.deleteMetadata(MOCK_COMPONENTS_METADATA, target);
    }
    const declarations = [];
    Reflect.defineMetadata(MOCK_COMPONENTS_METADATA, declarations, target);

    metadata.forEach(comp => {
      declarations.push(MockComponent(comp));
    });
  };
}

export function MockServices(metadata: Array<any>) {
  return (target: any) => {
    if (Reflect.hasMetadata(MOCK_SERVICES_METADATA, target)) {
      Reflect.deleteMetadata(MOCK_SERVICES_METADATA, target);
    }
    const providers = [];
    Reflect.defineMetadata(MOCK_SERVICES_METADATA, providers, target);

    metadata.forEach(serviceType => {
      providers.push({ provide: serviceType, useValue: createStub(serviceType) });
    });
  };
}

function privateMock(metadata: Array<any>, type: string) {
  return (target: any) => {
    if (Reflect.hasMetadata(type, target)) {
      Reflect.deleteMetadata(type, target);
    }
    Reflect.defineMetadata(type, metadata, target);
  };
}
export function Declarations(metadata: Array<any>) {
  return privateMock(metadata, DECLARATIONS_METADATA);
}
export function Imports(metadata: Array<any>) {
  return privateMock(metadata, IMPORTS_METADATA);
}
export function Providers(metadata: Array<any>) {
  return privateMock(metadata, PROVIDERS_METADATA);
}

export function MockService(metadata: any): MethodDecorator {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => { // target: constructor prototype
    const designatedMethod = descriptor.value;
    const stub = createStub(metadata);
    descriptor.value = (serviceType) => {
      const ret = designatedMethod(stub.__mock__());
      if (ret) {
        return {provide: metadata, useValue: ret};
      } else {
        return {provide: metadata, useValue: stub};
      }
    };
  };
}

interface ServiceProxy<T> {
  __mock__: (this: void) => T;
  [k: string]: any;
}

function createStub<T>(serviceType: (new (...args: any[]) => T) | (Function & {
  prototype: T;
})): any {
  const mockedService = mock(serviceType);

  return new Proxy(instance(mockedService), {
    get(target: any, propertyKey) {
      if (propertyKey === '__mock__') {
        return () => mockedService;
      } else {
        return target[propertyKey];
      }
    }
  });
}

function createModuleConfig(target: any): any {
  let imports = Reflect.getMetadata(IMPORTS_METADATA, target.constructor) || [];
  let declarations = Reflect.getMetadata(DECLARATIONS_METADATA, target.constructor) || [];
  let providers = Reflect.getMetadata(PROVIDERS_METADATA, target.constructor) || [];

  declarations = Object.assign([], declarations);
  providers = Object.assign([], providers);
  imports = Object.assign([], imports);

  declarations.push(target.componentType);

  const mockComponents = Reflect.getMetadata(MOCK_COMPONENTS_METADATA, target.constructor);
  if (mockComponents) {
    mockComponents.forEach((comp: any) => {
      declarations.push(comp);
    });
  }

  const mockServices = Reflect.getMetadata(MOCK_SERVICES_METADATA, target.constructor);
  if (mockServices) {
    mockServices.forEach((provider: any) => {
      providers.push(provider);
    });
  }

  return {
    imports,
    declarations,
    providers
  };
}

export function Before(classPrototype: any, methodName: string, descriptor: PropertyDescriptor) {
  const designatedMethod = descriptor.value;

  descriptor.value = function(init?: (this: void) => void) {
    this.componentType = Reflect.getMetadata(ENTRY_COMPONENT_TYPE_METADATA, this.constructor);

    const globalModuleConfig = createModuleConfig(this);

    // @ts-ignore
    beforeEach(async(() => {
      const localModuleConfig = {...globalModuleConfig};
      const innerProviders = Object.assign([], localModuleConfig.providers);

      Object.getOwnPropertyNames(this.constructor.prototype).forEach(funcName => {
        if (funcName.startsWith('mock')) {
          const ret = this[funcName](null);
          if (ret.provide) {
            innerProviders.push(ret);
          }
        }
      });

      localModuleConfig.providers = innerProviders;

      TestBed.configureTestingModule(localModuleConfig).compileComponents();
      designatedMethod.call(this, init);
    }));
  };
  return descriptor;
}

export abstract class TestSpec<T> {
  component: T;
  fixture: ComponentFixture<T>;
  componentType: Type<T>;

  @Before
  setup(init?: (this: void) => void) {
    this.fixture = TestBed.createComponent(this.componentType);
    this.component = this.fixture.componentInstance;
    if (init) {
      init();
    }
    this.fixture.detectChanges();
  }

  mock<ObjectType>(
    objectType: Type<ObjectType> | InjectionToken<ObjectType>,
    notFoundValue?: ObjectType, flags?: InjectFlags): ObjectType {
    const serviceInstance = TestBed.get(objectType, notFoundValue, flags);
    if (serviceInstance) {
      try {
        return serviceInstance.__mock__();
      } catch (err) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  get<ObjectType>(
    objectType: Type<ObjectType> | InjectionToken<ObjectType>,
    notFoundValue?: ObjectType, flags?: InjectFlags): ObjectType {
    return TestBed.get(objectType, notFoundValue, flags);
  }

  queryDebugElement(cssSelector: string) {
    return this.debugElement.query(By.css(cssSelector));
  }

  $(cssSelector: string) {
    return this.queryDebugElement(cssSelector);
  }

  queryDebugElementFrom(el: DebugElement, cssSelector: string) {
    return el.query(By.css(cssSelector));
  }

  get debugElement() {
    if (!this.fixture) {
      return undefined;
    }
    return this.fixture.debugElement;
  }
}
