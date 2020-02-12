import { MockComponent } from 'ng-mocks';

export function ComponentTest(metadata: any) {
  return function(target:any) {
    console.log('=====ComponentTest', metadata, target);
  }
}

export function MockComponents(metadata: Array<any>) {
  return function(target: any) {
    metadata.forEach(comp => {
      MockComponent(comp);
    });
  }
}
