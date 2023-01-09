import { Type } from '@angular/core';
import { MetadataConstants } from '../metadata-constants.enum';

function defineMetadata(metadata: Array<Type<any>>, type: string) {
  // tslint:disable-next-line: ban-types
  return (target: Function) => {
    if (Reflect.hasMetadata(type, target)) {
      Reflect.deleteMetadata(type, target);
    }
    Reflect.defineMetadata(type, metadata, target);
  };
}
export function Declarations(componentTypes: Array<Type<any>>) {
  return defineMetadata(componentTypes, MetadataConstants.DECLARATIONS_METADATA);
}
export function Imports(moduleTypes: Array<Type<any>>) {
  return defineMetadata(moduleTypes, MetadataConstants.IMPORTS_METADATA);
}
export function Providers(serviceTypes: Array<Type<any>>) {
  return defineMetadata(serviceTypes, MetadataConstants.PROVIDERS_METADATA);
}
