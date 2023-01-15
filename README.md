# NgEasyMocks

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.5.

## How to create a unit test using ng-easy-mocks

## unit tests for components

use `ng generate ng-easy-mocks:component ...` to generate a component, same as the way `ng generate component ...`

### Create a ComponentTest class for a specific component

```Javascript
@ComponentTest(ComponentName)
class ComponentNameSpec extends ComponentTestSpec<ComponentName> {

}
```

### decorators/annotations that can be used on the ComponentSpec class

- @ComponentTest, declares that the class is a component test class.
- @MockComponents, mock a list of components by using ts-mock mockComponent method and config them within TestBed.
- @MockServices, mock a list of service by using ts-mockito and config them within TestBed
- @Declarations, config declarations within TestBed
- @Imports, config imports within TestBed
- @Providers, config providers within TestBed

### mock a service used by a component when the component is created/initialized

- Define a mock...Service method and put a @MockService annotation on it, this will config a related provider within TestBed and mock the service.

## unit tests for services

use `ng generate ng-easy-mocks:service ...` to generate a component, same as the way `ng generate service ...`

### Create a ServiceTest class for a specific Service

```Javascript
@ServiceTest(ServiceName)
class ServiceNameSpec extends ServiceTestSpec<ServiceName> {

}
```

### decorators/annotations that can be used on the ServiceNameSpec class

- @ServiceTest, declares that the class is a Service test class.
- @MockServices, mock a list of service by using ts-mockito and config them within TestBed
- @Imports, config imports within TestBed
- @Providers, config providers within TestBed

### mock a service used by a service when the service is created

- Define a mock...Service method and put a @MockService annotation on it, this will config a related provider within TestBed and mock the service.
