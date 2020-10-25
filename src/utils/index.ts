import { Observable, Observer } from 'rxjs';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export interface HttpResponse {
  id: number;
  value: string;
  isDone: boolean;
}

let dbIndex = 0;
export function mockHttpPost(value: string): Observable<HttpResponse> {
  return Observable.create((observer: Observer<HttpResponse>) => {
    let status = 'pending';
    const timer = setTimeout(() => {
      const result = {
        id: ++dbIndex,
        value,
        isDone: false
      };
      status = 'done';
      observer.next(result);
      observer.complete();
    }, getRandomInt(10, 1000));

    return () => {
      clearTimeout(timer);
      if (status === 'pending') {
        console.warn('post cancel');
      }
    };
  });
}
