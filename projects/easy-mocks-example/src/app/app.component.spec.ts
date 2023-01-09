import { TitleService } from './title.service';
import { AppComponent } from './app.component';
import { ComponentTest, MockService, ComponentTestSpec } from 'ng-easy-mocks';
import { when, verify } from 'ts-mockito';

@ComponentTest(AppComponent)
class AppComponentSpec extends ComponentTestSpec<AppComponent> {
  @MockService(TitleService)
  mockTitleService(stub: TitleService) {
    when(stub.genTitle()).thenReturn('hello');
  }
}

describe('AppComponent', () => {
  const tc = new AppComponentSpec();
  tc.setup();

  it('should create the app', () => {
    expect(tc.component).toBeTruthy();
  });

  it(`should have as title 'hello'`, () => {
    expect(tc.component.title).toEqual('hello');
  });

  it('should render title', () => {
    expect(tc.$('.content').$all('span')[0].textContent).toContain('hello app is running!');
    expect(tc.$('.content').$('span').textContent).toContain('hello app is running!');
    expect(tc.$('.content span').textContent).toContain('hello app is running!');
    expect(tc.$('.content', 'span').textContent).toContain('hello app is running!');
  });

  it('should call title service', () => {
    verify(tc.mock(TitleService).genTitle()).called();
  });

  it(`should have as title 'refresh'`, () => {
    when(tc.mock(TitleService).genTitle()).thenReturn('refresh');
    tc.component.ngOnInit();
    expect(tc.component.title).toEqual('refresh');
  });
});
