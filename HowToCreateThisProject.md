# NgEasyMocks

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.5.

## Steps to create this project

### Create a workspace

Run `ng new ng-easy-mocks --create-application=false` to create a workspace. We are setting –create-application to false as not to create the initial Angular 15 application in the workspace. Here ‘ng-easy-mocks’ is the workspace name. You can name it anything you want.

### Create an application in the workspace

Change the directory to ng-easy-mocks, and run `ng generate application tutorial-crud` to create a new Angular application.

```bash
ng new tutorial-crud
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? SCSS
```

### Generate components and services

```bash
ng g class --project=tutorial-crud models/tutorial --type=model

ng g component --project=tutorial-crud components/add-tutorial
ng g component --project=tutorial-crud components/tutorial-details
ng g component --project=tutorial-crud components/tutorials-list

ng g service --project=tutorial-crud services/tutorial
```

### Set up App Module

Open app.module.ts and import FormsModule, HttpClientModule:

```Javascript
...
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ ... ],
  imports: [
    ...
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Define Routes for Angular 15 Project

There are 3 main routes:

- /tutorials for tutorials-list component
- /tutorials/:id for tutorial-details component
- /add for add-tutorial component

app-routing.module.ts

```Javascript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';

const routes: Routes = [
  { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialsListComponent },
  { path: 'tutorials/:id', component: TutorialDetailsComponent },
  { path: 'add', component: AddTutorialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Import Bootstrap into Angular 15 Project

Run `npm install bootstrap@latest` to install bootstrap

Next, open styles.scss and add following code:

```Javascript
@import "~bootstrap/dist/css/bootstrap.css";
```

### Add Navbar and Router View to Angular 15 CRUD example

Let’s open src/app.component.html, this App component is the root container for our application, it will contain a nav element.

### Define Model Class

models/tutorial.model.ts

### Create Data Service

This service will use Angular HTTPClient to send HTTP requests.
You can see that its functions includes CRUD operations and finder method.

services/tutorial.service.ts

### Create Angular 15 Components

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
