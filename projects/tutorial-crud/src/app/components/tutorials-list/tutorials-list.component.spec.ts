import { TutorialsListComponent } from './tutorials-list.component';
import { ComponentTestSpec } from '../../../../../ng-easy-mocks/src/lib/component-test-spec';
import { ComponentTest, Imports, MockComponents, MockService } from 'ng-easy-mocks';
import { TutorialDetailsComponent } from '../tutorial-details/tutorial-details.component';
import { TutorialService } from '../../services/tutorial.service';

import tutorials from '../../services/test-data/tutorials.json';
import { when } from 'ts-mockito';
import { cold } from 'jasmine-marbles';
import { FormsModule } from '@angular/forms';

@ComponentTest(TutorialsListComponent)
@MockComponents([TutorialDetailsComponent])
@Imports([FormsModule])
class TutorialsListComponentSpec extends ComponentTestSpec<TutorialsListComponent>{
  @MockService(TutorialService)
  mockTutorialService(mockedService: TutorialService) {
    when(mockedService.getAll()).thenReturn(cold('--a-|', { a: tutorials }));
  }
}

describe('TutorialsListComponent', () => {
  const tc = new TutorialsListComponentSpec();
  tc.setup();

  it('should create', () => {
    expect(tc.component).toBeTruthy();
  });
});
