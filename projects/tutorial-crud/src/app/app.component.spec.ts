import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ComponentTestSpec } from '../../../ng-easy-mocks/src/lib/component-test-spec';
import { ComponentTest } from 'ng-easy-mocks';

@ComponentTest(AppComponent)
class AppComponentSpec extends ComponentTestSpec<AppComponent> {

}

describe('AppComponent', () => {
  const tc = new AppComponentSpec();
  tc.setup();

  it('should create the app', () => {
    expect(tc.component).toBeTruthy();
  });

  it(`should have as title 'tutorial-crud'`, () => {
    expect(tc.component.title).toEqual('tutorial-crud');
  });

  it('should render navbar', () => {
    expect(tc.$('.navbar [routerLink="tutorials"]').textContent).toContain('Tutorials');
    expect(tc.$('.navbar li a.nav-link[routerLink="add"]').textContent).toContain('Add');
  });
});
