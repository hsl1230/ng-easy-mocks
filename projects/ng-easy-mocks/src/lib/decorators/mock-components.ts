import { Type } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { MetadataConstants } from '../metadata-constants.enum';

/**
 * a class decorator factory method on a component test class
 * to declare components to be mocked.
 * @param componentTypes a list of component types to be mocked
 * @returns a class decorator on the component test class
 */
export function MockComponents(componentTypes: Array<Type<any>>) {
  // tslint:disable-next-line: ban-types
  return (target: Function) => { // component class constructor
    if (Reflect.hasMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, target)) {
      Reflect.deleteMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, target);
    }
    const declarations = [];
    Reflect.defineMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, declarations, target);

    componentTypes.forEach(comp => {
      declarations.push(MockComponent(comp));
    });
  };
}
