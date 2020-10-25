import { HttpResponse } from './index';

export function createItem(data: HttpResponse) {
  const result = document.createElement('li');
  result.classList.add('item');
  result.innerHTML = `
    ${data.value}
    <button class="remove">删除<span class="glyphicon glyphicon-remove" aria-hidden="true">1</span></button>
  `;
  return result;
}
