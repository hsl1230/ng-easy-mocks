import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentTest, ComponentTestSpec, Imports, MockService } from 'ng-easy-mocks';
import { anything, capture, resetCalls, verify, when } from 'ts-mockito';
import { TutorialService } from '../../services/tutorial.service';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import tutorial from './test-data/tutorial.json';
import { AddTutorialComponent } from './add-tutorial.component';
import { FormsModule } from '@angular/forms';

@ComponentTest(AddTutorialComponent)
@Imports([FormsModule])
class AddTutorialComponentSpec extends ComponentTestSpec<AddTutorialComponent> {
  @MockService(TutorialService)
  mockTutorialService(mockService: TutorialService) {
    when(mockService.create(anything())).thenReturn(cold('---a-|', { a: tutorial }));
  }
}

describe('AddTutorialComponent', () => {
  const ts = new AddTutorialComponentSpec();
  ts.setup();

  it('should create', () => {
    expect(ts.component).toBeTruthy();
  });

  it('should show input form', () => {
    expect(ts.$all('.submit-form input').length).toEqual(2);
  });

  describe("Input values", () => {
    beforeEach(() => {
      const inputs = ts.$all('.submit-form input');
      const titleInput = inputs[0].nativeElement as HTMLInputElement;
      titleInput.value = 'testTitle';
      inputs[0].triggerEventHandler('input', {target: titleInput});

      const descriptionInput = inputs[1].nativeElement as HTMLInputElement;
      descriptionInput.value = 'test description';
      inputs[1].triggerEventHandler('input', { target: descriptionInput });

      resetCalls(ts.mock(TutorialService));
    });

    it('should inputs updated into the model', () => {
      expect(ts.component.tutorial.title).toEqual('testTitle');
      expect(ts.component.tutorial.description).toEqual('test description');
    });

    it('should save successfully', () => {
      ts.$(".submit-form button").nativeElement.click();
      getTestScheduler().flush();

      const mockTutorialService = ts.mock(TutorialService);
      verify(mockTutorialService.create(anything())).once();
      const [requestArg] = capture(mockTutorialService.create).last();
      expect(requestArg.title).toEqual('testTitle');

      ts.fixture.autoDetectChanges();

      expect(ts.component.submitted).toBeTruthy();

      expect(ts.$(".submit-form h4").textContent).toContain('Tutorial was submitted successfully!');
    });

    describe('fail creating', () => {
      beforeEach(() => {
        when(ts.mock(TutorialService).create(anything())).thenReturn(cold('--#-'));
        resetCalls(ts.mock(TutorialService));
      });

      it('should save failed', () => {
        ts.$(".submit-form button").nativeElement.click();
        getTestScheduler().flush();

        const mockTutorialService = ts.mock(TutorialService);
        verify(mockTutorialService.create(anything())).once();
        const [requestArg] = capture(mockTutorialService.create).last();
        expect(requestArg.title).toEqual('testTitle');

        ts.fixture.autoDetectChanges();

        expect(ts.component.submitted).toBeFalsy();

        expect(ts.$(".submit-form h4")).toBeFalsy();
      });
    });
  });
});
