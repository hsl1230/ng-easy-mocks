# NgEasyMocks

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

## link the lib with app

- build the lib using npm run build ng-easy-mocks
- cd dist/ng-easy-mocks
- npm link
- cd $root_of_angular_workspace
- npm link ng-easy-mocks

## build schematics

- cd projects/ng-easy-mocks
- npm run build

## Code scaffolding

## create a component with ng-easy-mocks tests

- ng g ng-easy-mocks:c component_name --project=$project_name

Run `ng generate component component-name --project ng-easy-mocks` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ng-easy-mocks`.
> Note: Don't forget to add `--project ng-easy-mocks` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ng-easy-mocks` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ng-easy-mocks`, go to the dist folder `cd dist/ng-easy-mocks` and run `npm publish`.

## Running unit tests

Run `ng test ng-easy-mocks` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
