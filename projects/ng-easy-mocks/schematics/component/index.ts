import {
  Rule,
  externalSchematic,
  chain,
  Tree,
  strings,
  apply,
  applyTemplates,
  move,
  noop,
  filter,
  url,
  mergeWith,
  MergeStrategy
} from '@angular-devkit/schematics';

import { Schema as ComponentOptions } from '@schematics/angular/component/schema';
import { createDefaultPath } from '@schematics/angular/utility/workspace';
import { parseName } from '@schematics/angular/utility/parse-name';
import { validateClassName } from '@schematics/angular/utility/validation';

export default function (options: ComponentOptions): Rule {
  // This schematic uses an older method to implement the flat option
  const genOptions = { ...options };
  const flat = genOptions.flat;
  genOptions.flat = true;

  return chain([
    externalSchematic('@schematics/angular', 'component', options),
    generateFromFiles(genOptions, {
      'if-flat': (s: string) => (flat ? '' : s),
    })
  ]);
}

interface GenerateFromFilesOptions extends ComponentOptions{
  templateFilesDirectory?: string;
}

function generateFromFiles(
  options: GenerateFromFilesOptions,
  extraTemplateValues: Record<string, string | ((v: string) => string)> = {},
): Rule {
  return async (host: Tree) => {
    options.path ??= await createDefaultPath(host, options.project);
    options.prefix ??= '';
    options.flat ??= true;

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    validateClassName(strings.classify(options.name));

    const templateFilesDirectory = options.templateFilesDirectory ?? './files';
    const templateSource = apply(url(templateFilesDirectory), [
      options.skipTests ? filter((path) => !path.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({
        ...strings,
        ...options,
        ...extraTemplateValues,
      }),
      move(parsedPath.path + (options.flat ? '' : '/' + strings.dasherize(options.name))),
    ]);

    return chain([mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}
