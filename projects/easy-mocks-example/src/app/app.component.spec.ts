import { TitleService } from './title.service';
import { AppComponent } from './app.component';
import { ComponentTest, MockService, TestSpec } from 'ng-easy-mocks';
import { when, verify } from 'ts-mockito';

@ComponentTest(AppComponent)
class AppComponentSpec extends TestSpec<AppComponent> {
  @MockService(TitleService)
  mockTitleServide(stub: TitleService) {
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
    const compiled = tc.fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('hello app is running!');
  });

  it('should call title service', () => {
    verify(tc.mock(TitleService).genTitle()).called();
  });
});
