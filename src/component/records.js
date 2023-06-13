const parametrs = ['Time, s', 'Difficulty', 'Mines', 'Steps'];
export const modalRecord = document.createElement('div');
modalRecord.classList.add('modal-record');
const wrapper = document.createElement('div');
wrapper.classList.add('modal-record__wrapper');
const title = document.createElement('h2');
title.classList.add('modal-record__title');
title.textContent = 'Records';

const table = document.createElement('table');
table.classList.add('modal-record__list');

const thead = document.createElement('thead');
const tr = document.createElement('tr');
parametrs.forEach((element) => {
  const td = document.createElement('td');
  td.textContent = element;
  tr.append(td);
});

thead.append(tr);
export const tbody = document.createElement('tbody');

table.append(thead, tbody);
export const closeRecords = document.createElement('button');
closeRecords.classList.add('modal-record__close');
closeRecords.innerHTML = 'CLOSE';
wrapper.append(title, table, closeRecords);

modalRecord.append(wrapper);
