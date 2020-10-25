import { fromEvent } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  mapTo,
  merge,
  mergeMap,
  publishReplay,
  refCount,
  switchMap,
  tap
} from 'rxjs/operators';
import { createItem } from './utils/template';
import { mockHttpPost } from './utils';

const $input = document.querySelector('.input input') as HTMLInputElement;
const $add = document.querySelector('.add') as HTMLElement;
const $content = document.querySelector('.content') as HTMLElement;

const keyDown$ = fromEvent<KeyboardEvent>($input, 'keydown').pipe(filter((e) => e.key === 'Enter'));
const add$ = fromEvent($add, 'click');

const item$ = keyDown$.pipe(
  merge(add$),
  map(() => $input.value),
  filter((v) => v !== ''),
  debounceTime(300),
  switchMap(mockHttpPost),
  map(createItem),
  tap((element) => {
    $content.appendChild(element);
    $input.value = '';
  }),
  publishReplay(1),
  refCount()
);

const toogle$ = item$.pipe(
  mergeMap(($item) => {
    return fromEvent($item, 'click').pipe(mapTo($item));
  }),
  tap(($item) => {
    if ($item.classList.contains('complete')) {
      $item.classList.remove('complete');
    } else {
      $item.classList.add('complete');
    }
  })
);

const remove$ = item$.pipe(
  mergeMap(($item) => {
    const $removeButton = $item.querySelector('.remove') as HTMLElement;
    return fromEvent<HTMLElement>($removeButton, 'click').pipe(
      tap(() => {
        const parentNode = $item.parentNode!;
        parentNode.removeChild($item);
      })
    );
  })
);

const app$ = toogle$.pipe(
  merge(remove$),
  tap((v) => console.log(v))
);
app$.subscribe();
