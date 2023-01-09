import { MetadataConstants } from './metadata-constants.enum';
import 'reflect-metadata';
import { TestModuleMetadata } from '@angular/core/testing';

export function createModuleDef<T>(target: any): TestModuleMetadata {
  let imports = Reflect.getMetadata(MetadataConstants.IMPORTS_METADATA, target.constructor) || [];
  let declarations = Reflect.getMetadata(MetadataConstants.DECLARATIONS_METADATA, target.constructor) || [];
  let providers = Reflect.getMetadata(MetadataConstants.PROVIDERS_METADATA, target.constructor) || [];

  declarations = Object.assign([], declarations);
  providers = Object.assign([], providers);
  imports = Object.assign([], imports);

  if (target.componentType) {
    declarations.push(target.componentType);
  }
  if (target.parentComponentType) {
    declarations.push(target.parentComponentType);
  }

  const mockComponents = Reflect.getMetadata(MetadataConstants.MOCK_COMPONENTS_METADATA, target.constructor);
  if (mockComponents) {
    mockComponents.forEach((comp: any) => {
      declarations.push(comp);
    });
  }

  const mockServices = Reflect.getMetadata(MetadataConstants.MOCK_SERVICES_METADATA, target.constructor);
  if (mockServices) {
    mockServices.forEach((provider: any) => {
      providers.push(provider);
    });
  }

  return {
    imports,
    declarations,
    providers
  } as TestModuleMetadata;
}
