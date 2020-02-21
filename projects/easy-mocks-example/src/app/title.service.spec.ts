import { TitleService } from './title.service';
import { ServiceTestSpec } from 'ng-easy-mocks';
import { ServiceTest } from 'projects/ng-easy-mocks/src/public-api';

@ServiceTest(TitleService)
class TitleServiceSpec extends ServiceTestSpec<TitleService> {
}

describe('TitleService', () => {
  const ts = new TitleServiceSpec();
  ts.setup();

  it('should be created', () => {
    expect(ts.service).toBeTruthy();
  });
});
