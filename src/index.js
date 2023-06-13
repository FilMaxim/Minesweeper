import commit from './component/localStorage';
import { closeRecords, modalRecord, tbody } from './component/records';
import {
  modalSetting, popap, recordsBtn, selectMines, selectSize,
  sound, victory, victoryContinue, victoryNewGame,
} from './component/setting';
import './style.scss';

// переменные уровень сложности
const levelSt = { easy: 10, medium: 15, hard: 25 };
let level = JSON.parse(localStorage.getItem('level')) || 'easy';
let ROW = levelSt[level];
let COLUMN = levelSt[level];
let MINE = JSON.parse(localStorage.getItem('MINE')) || 10;
let statusFirstClick = JSON.parse(localStorage.getItem('statusFirstClick')) || false;
let arrMines = JSON.parse(localStorage.getItem('arrMines'));
// счетчик открытых ячеек -- выигрыш---
let countOpen = JSON.parse(localStorage.getItem('countOpen')) || ROW ** 2;

let fieldSave;

const body = document.querySelector('body');

const title = document.createElement('h1');
title.classList.add('title');
title.textContent = 'Minesweeper';
const wrapperField = document.createElement('div');
wrapperField.classList.add('wrapper');

const buttonsSetting = document.createElement('div');
buttonsSetting.classList.add('buttonsSetting');

const time = document.createElement('input');
time.classList.add('buttonsSetting__input');
time.type = 'text';
time.value = JSON.parse(localStorage.getItem('timeSave')) || '000';
time.id = 'timer';
time.disabled = true;

const newGame = document.createElement('button');
newGame.classList.add('buttonsSetting__newGame');
newGame.type = 'submit';
newGame.innerHTML = 'new game';

const numberOfClicks = document.createElement('input');
numberOfClicks.classList.add('buttonsSetting__input');
numberOfClicks.type = 'text';
numberOfClicks.value = JSON.parse(localStorage.getItem('numberOfClicks')) || '000';
numberOfClicks.disabled = true;

const setting = document.createElement('button');
setting.classList.add('buttonsSetting__setting');

setting.addEventListener('click', () => {
  setting.classList.toggle('buttonsSetting__setting--active');
  modalSetting.classList.toggle('modal-setting--active');
  popap.classList.toggle('popap--active');
  body.classList.toggle('unscroll');
});

popap.addEventListener('click', () => {
  if (modalSetting.classList.contains('modal-setting--active')) {
    setting.classList.remove('buttonsSetting__setting--active');
    modalSetting.classList.remove('modal-setting--active');
    popap.classList.remove('popap--active');
    body.classList.remove('unscroll');
  }
});

// результаты игры
const arrResult = JSON.parse(localStorage.getItem('arrResult')) || [];
function renderRecords(arr) {
  tbody.innerHTML = '';
  if (arr.length === 0) return;
  arr.forEach((element) => {
    const tr = document.createElement('tr');
    arr[0].forEach((el, index) => {
      const td = document.createElement('td');
      td.textContent = element[index];
      tr.append(td);
    });

    tbody.append(tr);
  });
}
recordsBtn.addEventListener('click', () => {
  renderRecords(arrResult);
  modalRecord.classList.add('modal-record--active');
  if (modalSetting.classList.contains('modal-setting--active')) {
    setting.classList.remove('buttonsSetting__setting--active');
    modalSetting.classList.remove('modal-setting--active');
  }
  body.classList.add('unscroll');
});

closeRecords.addEventListener('click', () => {
  popap.classList.remove('popap--active');
  modalRecord.classList.remove('modal-record--active');
  body.classList.remove('unscroll');
});

// audio
let statusSound = false;
let music = new Audio();
function playMusic(src, status) {
  if (status) return;
  music.pause();
  music = new Audio(src);
  music.volume = 0.9;
  music.play();
}
sound.addEventListener('change', () => {
  statusSound = !statusSound;
});

buttonsSetting.append(time, newGame, numberOfClicks, setting, modalSetting);

const fieldwrapper = document.createElement('div');
fieldwrapper.classList.add('fieldwrapper');

wrapperField.append(buttonsSetting, fieldwrapper);

body.append(title, wrapperField, popap, victory, modalRecord);

// запуск таймера
let startTime;
function timer() {
  const zeroLength = 3;
  time.value = (Number(time.value) + 1).toString().padStart(zeroLength, '0');
}

// запуск счетчика кликов
function countClick() {
  numberOfClicks.value = (Number(numberOfClicks.value) + 1).toString().padStart(3, '0');
}

function startGame(row, column, mine) {
  const countBtn = row * column;
  if (fieldwrapper.firstChild) fieldwrapper.firstChild.remove();
  const field = document.createElement('div');
  field.classList.add('field');
  field.innerHTML = JSON.parse(localStorage.getItem('fieldSave')) || '<button class="field__botton"></button>'.repeat(countBtn);
  field.setAttribute('level', `${level}`);
  fieldwrapper.append(field);

  // массив с позицией мин
  const createArrMines = () => {
    let a = [...Array(countBtn).keys()];
    a = a.map((el) => el + 1);
    a = a.sort(() => Math.random() - 0.5);
    a = a.sort(() => Math.random() - 0.5);
    return a;
  };

  // массив всех кнопок
  const arrChildrenField = [...field.children];

  // является ли кнопка - миной
  const isMine = (x, y) => {
    if (!(x > 0 && y > 0 && x <= ROW && y <= COLUMN)) {
      return false;
    }
    const indexPosition = x * ROW + y - ROW;
    return arrMines.includes(indexPosition);
  };

  // проверка сколько всего мин рядом
  const getMinesCount = (x, y) => {
    let countMine = 0;
    for (let posX = -1; posX <= 1; posX += 1) {
      for (let posY = -1; posY <= 1; posY += 1) {
        if (isMine(x + posX, y + posY)) {
          countMine += 1;
        }
      }
    }
    return countMine;
  };
  // проверка кнопки на пустоту (нет мин вокруг)
  const openBtn = (x, y) => {
    const indexPos = x * ROW + y - ROW - 1;

    // elementClick.classList.add('open');
    if (!(x > 0 && y > 0 && x <= ROW && y <= COLUMN)) {
      return;
    }
    if (arrChildrenField[indexPos].classList.contains('field-flag')) return;

    if (arrChildrenField[indexPos].disabled) {
      arrChildrenField[indexPos].classList.remove('field-flag');
      return;
    }

    const countMines = getMinesCount(x, y);

    if (isMine(x, y)) {
      arrChildrenField[indexPos].classList.remove('field-flag');
      arrChildrenField[indexPos].style.border = '2px solid red';
      arrChildrenField[indexPos].disabled = true;
      arrMines.forEach((element) => {
        arrChildrenField[element - 1].classList.add('field-mine');
      });
      victory.classList.add('victory--active');
      victory.firstChild.textContent = 'Game over. Try again';
      victoryContinue.classList.add('victory-btn--noactive');
      statusFirstClick = !statusFirstClick;
      popap.classList.toggle('popap--active');
      playMusic('images/bang.mp3', statusSound);
      clearInterval(startTime);
      return;
    }

    if (countMines !== 0) {
      arrChildrenField[indexPos].innerHTML = countMines;
      if (countMines === 1) arrChildrenField[indexPos].style.color = 'blue';
      if (countMines === 2) arrChildrenField[indexPos].style.color = 'green';
      if (countMines === 3) arrChildrenField[indexPos].style.color = 'red';
      if (countMines === 4) arrChildrenField[indexPos].style.color = 'rgb(49, 5, 100)';
      if (countMines === 5) arrChildrenField[indexPos].style.color = 'green';
      if (countMines === 6) arrChildrenField[indexPos].style.color = 'broun';
      if (countMines === 7) arrChildrenField[indexPos].style.color = 'rgb(0, 238, 255)';
      if (countMines === 8) arrChildrenField[indexPos].style.color = 'rgb(251, 11, 175)';
      arrChildrenField[indexPos].disabled = true;
    }

    if (countMines === 0) {
      arrChildrenField[indexPos].innerHTML = '';
      arrChildrenField[indexPos].disabled = true;

      for (let posX = -1; posX <= 1; posX += 1) {
        for (let posY = -1; posY <= 1; posY += 1) {
          openBtn(x + posX, y + posY);
        }
      }
    }
    countOpen -= 1;
    if (countOpen <= MINE) {
      victory.classList.add('victory--active');
      victory.firstChild.textContent = `Hooray! You found all the mines in ${Number(time.value)} seconds and ${Number(numberOfClicks.value)} moves!`;
      victoryContinue.classList.add('victory-btn--noactive');
      statusFirstClick = !statusFirstClick;

      popap.classList.toggle('popap--active');
      playMusic('images/victory.mp3', statusSound);
      arrResult.unshift([Number(time.value), level, MINE, Number(numberOfClicks.value)]);
      if (arrResult.length > 10) {
        arrResult.pop();
      }
      clearInterval(startTime);
    }
  };

  field.addEventListener('click', (event) => {
    if (!event.target.classList.contains('field__botton')) return;
    if (event.target.classList.contains('field-flag')) return;
    playMusic('images/click.mp3', statusSound);

    const elementClick = event.target;
    const indexClick = arrChildrenField.indexOf(elementClick);

    const rowClick = Math.floor(indexClick / COLUMN) + 1;
    const columnClick = Math.floor(indexClick % COLUMN) + 1;
    countClick();

    if (!statusFirstClick) {
      const arrMinesAll = createArrMines().filter((el) => el !== (indexClick + 1));
      arrMines = arrMinesAll.slice(0, mine);
      statusFirstClick = true;
      startTime = setInterval(timer, 1000);
    }

    openBtn(rowClick, columnClick);
  });

  // клик правой кнопкой мыши, флаг
  field.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    playMusic('images/flag.mp3', statusSound);
    const elementClick = event.target;
    if (!event.target.classList.contains('field__botton')) return;
    if (event.target.disabled) return;
    elementClick.classList.toggle('field-flag');
  });
}

// reset обновить игру
function reset() {
  clearInterval(startTime);
  localStorage.removeItem('fieldSave');
  localStorage.removeItem('arrMines');
  localStorage.removeItem('statusFirstClick');
  localStorage.removeItem('countOpen');
  countOpen = ROW ** 2;
  localStorage.removeItem('timeSave');
  localStorage.removeItem('numberOfClicks');

  numberOfClicks.value = '000';
  time.value = '000';
  statusFirstClick = false;
  startGame(ROW, COLUMN, MINE);
  victory.classList.remove('victory--active');
}

// кнопка начать игру сначала
newGame.addEventListener('click', () => {
  popap.classList.remove('popap--active');
  reset();
});

victoryNewGame.addEventListener('click', () => {
  popap.classList.remove('popap--active');
  reset();
});

victoryContinue.addEventListener('click', () => {
  victory.classList.remove('victory--active');
  popap.classList.remove('popap--active');
  startTime = setInterval(timer, 1000);
});
// слушатель на изменение уровня игры
selectSize.addEventListener('change', () => {
  level = selectSize.value;
  ROW = levelSt[level];
  COLUMN = levelSt[level];
  reset();
});

// слушатель на изменение кол-ва мин
selectMines.addEventListener('change', () => {
  MINE = selectMines.value;
  reset();
});
startGame(ROW, COLUMN, MINE);
window.addEventListener('beforeunload', () => {
  commit('level', level);
  commit('MINE', MINE);
  commit('statusFirstClick', statusFirstClick);
  commit('arrResult', arrResult);
  if (!statusFirstClick) {
    reset();
    return;
  }
  fieldSave = fieldwrapper.firstChild;
  commit('fieldSave', fieldSave.innerHTML);
  if (arrMines)commit('arrMines', arrMines);
  commit('countOpen', countOpen);
  commit('timeSave', time.value);
  commit('numberOfClicks', numberOfClicks.value);
});

window.addEventListener('DOMContentLoaded', () => {
  if (!statusFirstClick) return;
  victory.classList.add('victory--active');
  victoryNewGame.textContent = 'New Game';
  victory.firstChild.textContent = 'Would you like to continue?';
  popap.classList.add('popap--active');
  victoryContinue.classList.remove('victory-btn--noactive');
});
