import { ServiceTestSpec } from './service-test-spec';

describe('ServiceTestSpec', () => {
  it('should create an instance', () => {
    expect(new TestServiceSpec()).toBeTruthy();
  });
});

class TestService {}

class TestServiceSpec extends ServiceTestSpec<TestService> {
}
