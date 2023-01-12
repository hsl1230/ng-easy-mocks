import { Type } from '@angular/core';
import { instance, mock } from 'ts-mockito';
import { MetadataConstants } from '../metadata-constants.enum';

/**
 * a class decorator factory method on a component/service test class to declare providers(services)
 * @param serviceTypes a list of service type
 * @returns a class decorator on the component/service test class
 */
export function MockServices(serviceTypes: Array<Type<any>>): ClassDecorator {
  // tslint:disable-next-line: ban-types
  return (target: Function) => {
    if (Reflect.hasMetadata(MetadataConstants.MOCK_SERVICES_METADATA, target)) {
      Reflect.deleteMetadata(MetadataConstants.MOCK_SERVICES_METADATA, target);
    }
    const providers: any[] = [];
    Reflect.defineMetadata(MetadataConstants.MOCK_SERVICES_METADATA, providers, target);

    serviceTypes.forEach(serviceType => {
      providers.push({ provide: serviceType, useFactory: () => createServiceStub(serviceType) });
    });
  };
}

/**
 * a method decorator factory method to create a mock of a service type for the whole test class.
 * @param serviceType service type
 * @returns a method decorator
 */
export function MockService<T extends object>(serviceType: Type<T>): MethodDecorator {
  return (target: any, methodName: string | symbol, descriptor: PropertyDescriptor) => { // target: constructor prototype
    const originalMethod: (serviceType: T) => any = descriptor.value;
    const stub = createServiceStub<T>(serviceType);
    descriptor.value = function(...args: any[]) {
      let mockedService = stub.__mock__();
      if (args && args.length > 0 && args[0]) {
        mockedService = args[0];
      }

      const ret = originalMethod.call(this, mockedService);
      return { provide: serviceType, useFactory: () => ret ? ret : stub };
    };
  };
}

export function createServiceStub<T extends object>(serviceType: Type<T>): T & { '__mock__': () => T } {
  const mockedService = mock<T>(serviceType);

  return new Proxy(instance<T>(mockedService), {
    get(target: any, propertyKey) {
      if (propertyKey === '__mock__') {
        return () => mockedService;
      } else {
        return target[propertyKey];
      }
    }
  });
}


