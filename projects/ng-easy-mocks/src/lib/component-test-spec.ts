import { TestHostComponent } from './test-host.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Type, DebugElement } from '@angular/core';
import { MetadataConstants } from './metadata-constants.enum';
import { createModuleDef } from './create-module-def';
import { By } from '@angular/platform-browser';
import { TestSpec } from './test-spec';

export interface SuperDebugElement extends DebugElement {
  readonly textContent: string;
  readonly nativeElement: HTMLElement;
  $(...cssSelectors: string[]): SuperDebugElement;
  $all(cssSelector: string): SuperDebugElement[];
}

function enhanceDebugElement() {
  const prototype: any = DebugElement.prototype;
  if (!prototype.$) {
    prototype.$ = function(...cssSelectors: string[]): SuperDebugElement {
      return this.query(By.css(cssSelectors.join(' ')));
    };

    prototype.$all = function(cssSelector: string): SuperDebugElement[] {
      return this.queryAll(By.css(cssSelector)) as SuperDebugElement[];
    };

    Object.defineProperty(
      DebugElement.prototype,
      'textContent',
      { get() { return this.nativeElement.textContent; } });
  }
}
export abstract class ComponentTestSpec<T> extends TestSpec<T> {
  component: T = null as T;
  parentComponent: TestHostComponent<T> = null as unknown as TestHostComponent<T>;
  fixture: ComponentFixture<T> | ComponentFixture<TestHostComponent<T>> = null as unknown as ComponentFixture<T> | ComponentFixture<TestHostComponent<T>>;
  componentType: Type<T> = null as unknown as Type<T>;
  parentComponentType: Type<TestHostComponent<T>> = null as unknown as Type<TestHostComponent<T>>;

  setup(init?: (this: void) => void) {
    enhanceDebugElement();

    this.componentType = Reflect.getMetadata(MetadataConstants.ENTRY_COMPONENT_TYPE_METADATA, this.constructor);
    this.parentComponentType = Reflect.getMetadata(MetadataConstants.PARENT_COMPONENT_TYPE_METADATA, this.constructor);

    const globalModuleConfig = createModuleDef(this);

    // @ts-ignore
    beforeEach(waitForAsync(() => {
      const localModuleConfig = {...globalModuleConfig};
      const innerProviders = Object.assign([], localModuleConfig.providers);
      const innerImports: Array<any> = Object.assign([], localModuleConfig.imports);
      if (!innerImports.includes(RouterTestingModule)) {
        innerImports.push(RouterTestingModule);
      }

      this.applyMockServiceFunctions(innerProviders);

      localModuleConfig.providers = innerProviders;
      localModuleConfig.imports = innerImports;

      TestBed.configureTestingModule(localModuleConfig).compileComponents();

      if (this.parentComponentType) {
        this.fixture = TestBed.createComponent(this.parentComponentType);
        this.parentComponent = this.fixture.componentInstance;
        if (init) {
          init();
        }
        this.fixture.detectChanges();
        this.component = this.parentComponent.testComponent;
      } else {
        this.fixture = TestBed.createComponent(this.componentType);
        this.component = this.fixture.componentInstance;
        if (init) {
          init();
        }
        this.fixture.detectChanges();
      }
    }));
  }

  $(...cssSelectors: string[]): SuperDebugElement {
    return this.debugElement?.$(...cssSelectors);
  }

  $all(cssSelector: string): SuperDebugElement[] {
    return this.debugElement?.$all(cssSelector);
  }

  get debugElement(): SuperDebugElement {
    return this.fixture?.debugElement as SuperDebugElement;
  }
}
