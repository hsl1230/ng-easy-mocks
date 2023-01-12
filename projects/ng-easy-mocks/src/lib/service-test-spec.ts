import { Type } from '@angular/core';
import { MetadataConstants } from './metadata-constants.enum';
import { createModuleDef } from './create-module-def';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestSpec } from './test-spec';

export abstract class ServiceTestSpec<T> extends TestSpec<T> {
  service: T = null as T;
  serviceType: Type<T> = null as unknown as Type<T>;
  httpMock: HttpTestingController = null as unknown as HttpTestingController;

  setup(init?: (this: void) => void) {
    this.serviceType = Reflect.getMetadata(MetadataConstants.ENTRY_SERVICE_TYPE_METADATA, this.constructor);

    const globalModuleConfig = createModuleDef(this);

    // @ts-ignore
    beforeEach(waitForAsync(() => {
      const localModuleConfig = {...globalModuleConfig};
      const innerProviders = Object.assign([], localModuleConfig.providers);
      const innerImports: Array<any> = Object.assign([], localModuleConfig.imports);
      if (!innerImports.includes(HttpClientTestingModule)) {
        innerImports.push(HttpClientTestingModule);
      }

      this.applyMockServiceFunctions(innerProviders);

      localModuleConfig.providers = innerProviders;
      localModuleConfig.imports = innerImports;
      localModuleConfig.declarations = undefined;

      TestBed.configureTestingModule(localModuleConfig);

      this.service = this.get(this.serviceType);
      this.httpMock = TestBed.inject(HttpTestingController);
      if (init) {
        init();
      }
    }));
  }
}
