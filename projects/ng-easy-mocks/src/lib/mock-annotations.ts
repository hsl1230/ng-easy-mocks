import { MetadataConstants } from './metadata-constants.enum';
import 'reflect-metadata';
import { MockComponent } from 'ng-mocks';
import { Type } from '@angular/core';
import { mock, instance } from 'ts-mockito';
import { ComponentTestSpec } from './component-test-spec';
import { TestHostComponent } from './test-host.component';
import { ServiceTestSpec } from './service-test-spec';

export function ComponentTest<T>(metadata: Type<T>, parentComponent?: Type<TestHostComponent<T>>) {
  return (target: any) => { // class constructor
    target.prototype.ngOnDestroy = () => {
      Reflect.deleteMetadata(MetadataConstants.ENTRY_COMPONENT_TYPE_METADATA, target);
      Reflect.deleteMetadata(MetadataConstants.PARENT_COMPONENT_TYPE_METADATA, target);
    };
    Reflect.defineMetadata(MetadataConstants.ENTRY_COMPONENT_TYPE_METADATA, metadata, target);
    Reflect.defineMetadata(MetadataConstants.PARENT_COMPONENT_TYPE_METADATA, parentComponent, target);
  };
}

export function ServiceTest<T>(metadata: Type<T>) {
  return (target: any) => { // class constructor
    target.prototype.ngOnDestroy = () => {
      Reflect.deleteMetadata(MetadataConstants.ENTRY_SERVICE_TYPE_METADATA, target);
    };
    Reflect.defineMetadata(MetadataConstants.ENTRY_SERVICE_TYPE_METADATA, metadata, target);
  };
}

export function MockComponents(metadata: Array<any>) {
  return (target: any) => { // class constructor
    if (Reflect.hasMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, target)) {
      Reflect.deleteMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, target);
    }
    const declarations = [];
    Reflect.defineMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, declarations, target);

    metadata.forEach(comp => {
      declarations.push(MockComponent(comp));
    });
  };
}

export function MockServices(metadata: Array<any>) {
  return (target: any) => {
    if (Reflect.hasMetadata(MetadataConstants.MOCK_SERVICES_METADATA, target)) {
      Reflect.deleteMetadata(MetadataConstants.MOCK_SERVICES_METADATA, target);
    }
    const providers = [];
    Reflect.defineMetadata(MetadataConstants.MOCK_SERVICES_METADATA, providers, target);

    metadata.forEach(serviceType => {
      providers.push({ provide: serviceType, useFactory: () => createStub(serviceType) });
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
  return privateMock(metadata, MetadataConstants.DECLARATIONS_METADATA);
}
export function Imports(metadata: Array<any>) {
  return privateMock(metadata, MetadataConstants.IMPORTS_METADATA);
}
export function Providers(metadata: Array<any>) {
  return privateMock(metadata, MetadataConstants.PROVIDERS_METADATA);
}

export function MockService(metadata: any): MethodDecorator {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => { // target: constructor prototype
    const designatedMethod = descriptor.value;
    const stub = createStub(metadata);
    descriptor.value = (serviceType) => {
      const ret = designatedMethod(stub.__mock__());
      if (ret) {
        return {provide: metadata, useFactory: () => ret};
      } else {
        return {provide: metadata, useFactory: () => stub};
      }
    };
  };
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

export function createModuleConfig<T>(target: any): any {
  let imports = Reflect.getMetadata(MetadataConstants.IMPORTS_METADATA, target.constructor) || [];
  let declarations = Reflect.getMetadata(MetadataConstants.DECLARATIONS_METADATA, target.constructor) || [];
  let providers = Reflect.getMetadata(MetadataConstants.PROVIDERS_METADATA, target.constructor) || [];

  declarations = Object.assign([], declarations);
  providers = Object.assign([], providers);
  imports = Object.assign([], imports);

  if (target.componentType) {
    declarations.push(target.componentType);
  }
  if (target.parentComponentType) {
    declarations.push(target.parentComponentType);
  }

  const mockComponents = Reflect.getMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, target.constructor);
  if (mockComponents) {
    mockComponents.forEach((comp: any) => {
      declarations.push(comp);
    });
  }

  const mockServices = Reflect.getMetadata(MetadataConstants.MOCK_SERVICES_METADATA, target.constructor);
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
