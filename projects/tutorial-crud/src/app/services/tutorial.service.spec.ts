import { TutorialService } from './tutorial.service';
import { ServiceTest, ServiceTestSpec } from 'ng-easy-mocks';

import tutorials from './test-data/tutorials.json';

@ServiceTest(TutorialService)
class TutorialServiceSpec extends ServiceTestSpec<TutorialService> {
}

describe('TutorialService', () => {
  const ts = new TutorialServiceSpec();
  ts.setup();

  it('should be created', () => {
    expect(ts.service).toBeTruthy();
  });

  it('should create a tutorial', (done) => {
    ts.service.create(tutorials[0]).subscribe((data) => {
      expect(data).toEqual(tutorials[0]);
      done();
    });

    const endpoint = 'http://localhost:8080/api/tutorials';
    ts.httpMock.expectOne({ method: 'POST', url: endpoint }).flush(tutorials[0]);
  })

  it('should get all tutorials', (done) => {
    ts.service.getAll().subscribe((data) => {
      expect(data).toEqual(tutorials);
      done();
    });

    const endpoint = 'http://localhost:8080/api/tutorials';
    ts.httpMock.expectOne({ method: 'GET', url: endpoint }).flush(tutorials);
  })

  it('should get the filtered tutorials', (done) => {
    ts.service.get('testTitle2').subscribe((data) => {
      expect(data).toEqual(tutorials[1]);
      done();
    });

    const endpoint = 'http://localhost:8080/api/tutorials/testTitle2';
    ts.httpMock.expectOne({ method: 'GET', url: endpoint }).flush(tutorials[1]);
  })

  it('should get the tutorial by id', (done) => {
    ts.service.get('testTitle2').subscribe((data) => {
      expect(data).toEqual(tutorials[1]);
      done();
    });

    const endpoint = 'http://localhost:8080/api/tutorials/testTitle2';
    ts.httpMock.expectOne({ method: 'GET', url: endpoint }).flush(tutorials[1]);
  });
});
