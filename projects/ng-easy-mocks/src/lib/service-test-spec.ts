import { Type, InjectionToken, InjectFlags } from '@angular/core';
import { MetadataConstants } from './metadata-constants.enum';
import { createModuleConfig } from './mock-annotations';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

export abstract class ServiceTestSpec<T> {
  service: T;
  serviceType: Type<T>;
  httpMock: HttpTestingController;

  setup(init?: (this: void) => void) {
    this.serviceType = Reflect.getMetadata(MetadataConstants.ENTRY_SERVICE_TYPE_METADATA, this.constructor);

    const globalModuleConfig = createModuleConfig(this);

    // @ts-ignore
    beforeEach(async(() => {
      const localModuleConfig = {...globalModuleConfig};
      const innerProviders = Object.assign([], localModuleConfig.providers);
      const innerImports: Array<any> = Object.assign([], localModuleConfig.imports);
      if (!innerImports.includes(HttpClientTestingModule)) {
        innerImports.push(HttpClientTestingModule);
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
      localModuleConfig.declarations = undefined;

      TestBed.configureTestingModule(localModuleConfig);

      this.service = this.get(this.serviceType);
      this.httpMock = TestBed.get(HttpTestingController);
      if (init) {
        init();
      }
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
}
