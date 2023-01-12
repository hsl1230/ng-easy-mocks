import { cold, getTestScheduler } from 'jasmine-marbles';
import { ComponentTest, ComponentTestSpec, MockService, Imports } from 'ng-easy-mocks';
import { anything, when } from 'ts-mockito';
import { TutorialService } from '../../services/tutorial.service';

import { TutorialDetailsComponent } from './tutorial-details.component';

import tutorials from '../../services/test-data/tutorials.json';
import { FormsModule } from '@angular/forms';

@ComponentTest(TutorialDetailsComponent)
@Imports([FormsModule])
class AddTutorialComponentSpec extends ComponentTestSpec<TutorialDetailsComponent> {
  @MockService(TutorialService)
  mockTutorialService(mockService: TutorialService) {
    when(mockService.get(anything())).thenReturn(cold('---a-|', { a: tutorials[0] }));
  }
}

describe('TutorialDetailsComponent', () => {
  const tc = new AddTutorialComponentSpec();
  tc.setup();

  it('should create', () => {
    expect(tc.component).toBeTruthy();
  });

  it('should render the tutorial', () => {
    getTestScheduler().flush();
    expect(tc.component.currentTutorial).toEqual(tutorials[0]);

    tc.fixture.autoDetectChanges();
    tc.fixture.whenStable().then(() => {
      const inputs = tc.$all('.edit-form input');
      const titleInput = inputs[0].nativeElement as HTMLInputElement;
      expect(titleInput.value).toEqual('testTitle1');
    });
  })
});
