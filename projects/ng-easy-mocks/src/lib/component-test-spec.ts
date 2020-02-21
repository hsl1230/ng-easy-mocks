import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Type, InjectionToken, InjectFlags, DebugElement } from '@angular/core';
import { MetadataConstants } from './metadata-constants.enum';
import { createModuleConfig } from './mock-annotations';
import { By } from '@angular/platform-browser';

export interface SuperDebugElement extends DebugElement {
  readonly textContent: string;
  readonly nativeElement: HTMLElement;
  $(...cssSelectors: string[]): SuperDebugElement;
  $all(cssSelector: string): SuperDebugElement[];
}

export abstract class ComponentTestSpec<T> {
  component: T;
  fixture: ComponentFixture<T>;
  componentType: Type<T>;

  setup(init?: (this: void) => void) {
    if (!DebugElement.prototype.$) {
      DebugElement.prototype.$ = function(...cssSelectors: string[]): SuperDebugElement {
        let el: DebugElement = this;
        cssSelectors.forEach(cssSelector => {
          if (el) {
            el = el.query(By.css(cssSelector));
          } else {
            return undefined;
          }
        });
        return el as SuperDebugElement;
      };

      DebugElement.prototype.$all = function(cssSelector: string): SuperDebugElement[] {
        return this.queryAll(By.css(cssSelector)) as SuperDebugElement[];
      };

      Object.defineProperty(DebugElement.prototype, 'textContent', { get() { return this.nativeElement.textContent; }});
    }

    this.componentType = Reflect.getMetadata(MetadataConstants.ENTRY_COMPONENT_TYPE_METADATA, this.constructor);

    const globalModuleConfig = createModuleConfig(this);

    // @ts-ignore
    beforeEach(async(() => {
      const localModuleConfig = {...globalModuleConfig};
      const innerProviders = Object.assign([], localModuleConfig.providers);
      const innerImports: Array<any> = Object.assign([], localModuleConfig.imports);
      if (!innerImports.includes(RouterTestingModule)) {
        innerImports.push(RouterTestingModule);
      }

      Object.getOwnPropertyNames(this.constructor.prototype).forEach(funcName => {
        if (funcName.startsWith('mock')) {
          const ret = this[funcName](null);
          if (ret.provide) {
            innerProviders.push(ret);
          }
        }
      });

      localModuleConfig.providers = innerProviders;
      localModuleConfig.imports = innerImports;

      TestBed.configureTestingModule(localModuleConfig).compileComponents();

      this.fixture = TestBed.createComponent(this.componentType);
      this.component = this.fixture.componentInstance;
      if (init) {
        init();
      }
      this.fixture.detectChanges();
    }));
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

  $(...cssSelectors: string[]): SuperDebugElement {
    return this.debugElement.$(...cssSelectors);
  }

  $all(cssSelector: string): SuperDebugElement[] {
    return this.debugElement.$all(cssSelector);
  }

  get debugElement(): SuperDebugElement {
    if (!this.fixture) {
      return undefined;
    }
    return this.fixture.debugElement as SuperDebugElement;
  }
}
