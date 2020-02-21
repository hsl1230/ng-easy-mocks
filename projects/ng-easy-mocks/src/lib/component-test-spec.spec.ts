import { ComponentTestSpec } from './component-test-spec';

describe('ComponentTestSpec', () => {
  it('should create an instance', () => {
    expect(new TestComponentSpec()).toBeTruthy();
  });
});

class TestComponent {

}

class TestComponentSpec extends ComponentTestSpec<TestComponent> {

}
