import { InjectionToken, InjectOptions, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createServiceStub } from './decorators/mock-services';

export abstract class TestSpec<T> {
  protected applyMockServiceFunctions(innerProviders: any[]) {
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(funcName => {
      if (funcName.startsWith('mock')) {
        // tslint:disable-next-line: ban-types
        const me: any = this;
        const mockFunction: Function = me[funcName];
        if (mockFunction instanceof Function) {
          const ret = mockFunction.apply(this, null);
          innerProviders.push(ret);
        }
      }
    });
  }

  mock<ObjectType extends object>(
    objectType: Type<ObjectType>,
    notFoundValue?: ObjectType, injectOptions?: InjectOptions): ObjectType {
    const serviceInstance:any = TestBed.inject(objectType, notFoundValue, injectOptions);
    if (serviceInstance) {
      if (serviceInstance.__mock__ instanceof Function) {
        return serviceInstance.__mock__();
      }
    }

    const stub = createServiceStub<ObjectType>(objectType);
    TestBed.overrideProvider(objectType, { useFactory: () => stub });
    return stub.__mock__();
  }

  get<ObjectType>(
    objectType: Type<ObjectType> | InjectionToken<ObjectType>,
    notFoundValue?: ObjectType, injectOptions?: InjectOptions): ObjectType {
    return TestBed.inject(objectType, notFoundValue, injectOptions);
  }
}
