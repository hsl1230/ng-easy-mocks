import { Type } from '@angular/core';
import { MetadataConstants } from '../metadata-constants.enum';
import { TestHostComponent } from '../test-host.component';

/**
 * A class decorator factory method on a component test class to declare the type of a component to be tested.
 * @param componentType the type of a component to be tested
 * @param parentComponentType parent component type
 * @returns a class decorator for the component test class
 */
export function ComponentTest<T>(componentType: Type<T>, parentComponentType?: Type<TestHostComponent<T>>): ClassDecorator {
  // tslint:disable-next-line: ban-types
  return (target: Function) => { // component class constructor
    target.prototype.ngOnDestroy = () => {
      Reflect.deleteMetadata(MetadataConstants.ENTRY_COMPONENT_TYPE_METADATA, target);
      Reflect.deleteMetadata(MetadataConstants.PARENT_COMPONENT_TYPE_METADATA, target);
    };
    Reflect.defineMetadata(MetadataConstants.ENTRY_COMPONENT_TYPE_METADATA, componentType, target);
    Reflect.defineMetadata(MetadataConstants.PARENT_COMPONENT_TYPE_METADATA, parentComponentType, target);
  };
}
