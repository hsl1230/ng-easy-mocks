import { Type } from '@angular/core';
import { MetadataConstants } from '../metadata-constants.enum';

/**
 * A class decorator factory method on a service test class to declare the type of a service to be tested.
 * @param serviceType type of the service
 * @returns a class decorator for the service test class
 */
export function ServiceTest<T>(serviceType: Type<T>): ClassDecorator {
  // tslint:disable-next-line: ban-types
  return (target: Function) => { // service class constructor
    target.prototype.ngOnDestroy = () => {
      Reflect.deleteMetadata(MetadataConstants.ENTRY_SERVICE_TYPE_METADATA, target);
    };
    Reflect.defineMetadata(MetadataConstants.ENTRY_SERVICE_TYPE_METADATA, serviceType, target);
  };
}
