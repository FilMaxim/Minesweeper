import commit from './localStorage';

const level = JSON.parse(localStorage.getItem('level')) || 'easy';
const MINE = JSON.parse(localStorage.getItem('MINE')) || 10;
export const modalSetting = document.createElement('div');
modalSetting.classList.add('modal-setting');
const ul = document.createElement('ul');
ul.classList.add('modal-setting__list');

const size = document.createElement('li');
size.classList.add('modal-setting__item');
const sizeP = document.createElement('p');
sizeP.classList.add('setting-title');
sizeP.textContent = 'Difficulty:';

export const selectSize = document.createElement('select');
selectSize.classList.add('size__select');
const option1 = document.createElement('option');
option1.value = 'easy';
option1.textContent = 'easy';
const option2 = document.createElement('option');
option2.value = 'medium';
option2.textContent = 'medium';
const option3 = document.createElement('option');
option3.value = 'hard';
option3.textContent = 'hard';
option1.selected = level === option1.value;
option2.selected = level === option2.value;
option3.selected = level === option3.value;

selectSize.append(option1, option2, option3);
size.append(sizeP, selectSize);

const countMine = document.createElement('li');
countMine.classList.add('modal-setting__item');
const countMineP = document.createElement('p');
countMineP.textContent = 'Count of mines:';
export const selectMines = document.createElement('select');
selectMines.classList.add('size__select');
for (let i = 10; i < 100; i += 1) {
  const optionMine = document.createElement('option');
  optionMine.value = i;
  optionMine.textContent = i;
  if (i === Number(MINE)) optionMine.selected = true;
  selectMines.append(optionMine);
}
countMine.append(countMineP, selectMines);

const theme = document.createElement('li');
theme.classList.add('modal-setting__item');
const themeP = document.createElement('p');
themeP.textContent = 'Theme:';
const themeBtn = document.createElement('label');
themeBtn.classList.add('checkbox-theme');
const themeImput = document.createElement('input');
themeImput.type = 'checkbox';
const themeSpan = document.createElement('span');
themeSpan.classList.add('checkbox-switch');
themeBtn.append(themeImput, themeSpan);

theme.append(themeP, themeBtn);

export const sound = document.createElement('li');
sound.classList.add('modal-setting__item');
const soundP = document.createElement('p');
soundP.textContent = 'Sound:';
const soundBtn = document.createElement('label');
soundBtn.classList.add('checkbox-theme');
const soundImput = document.createElement('input');
soundImput.type = 'checkbox';
const soundSpan = document.createElement('span');
soundSpan.classList.add('checkbox-switch');
soundBtn.append(soundImput, soundSpan);
sound.append(soundP, soundBtn);

const records = document.createElement('li');
records.classList.add('modal-setting__item');
export const recordsBtn = document.createElement('button');
recordsBtn.classList.add('modal-record__close');
recordsBtn.textContent = 'Records';
records.append(recordsBtn);

ul.append(size, countMine, theme, sound);
modalSetting.append(ul, records);

// переключение темы
let statusTheme = JSON.parse(localStorage.getItem('statusTheme')) || false;
themeImput.checked = statusTheme;
if (statusTheme) {
  document.documentElement.setAttribute('data-theme', 'dark');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
}
themeBtn.addEventListener('change', () => {
  console.log(themeBtn.checked);
  if (!statusTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    statusTheme = !statusTheme;
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    statusTheme = !statusTheme;
  }
  commit('statusTheme', statusTheme);
});

export const popap = document.createElement('div');
popap.classList.add('popap');

export const victory = document.createElement('div');
victory.classList.add('victory');
const span = document.createElement('span');
span.classList.add('title-result');
span.textContent = 'You won!!! Congratulation';

const victoryBtns = document.createElement('div');
victoryBtns.classList.add('victory__wrapper');

export const victoryContinue = document.createElement('button');
victoryContinue.classList.add('modal-record__close');
victoryContinue.innerHTML = 'Continue';

export const victoryNewGame = document.createElement('button');
victoryNewGame.classList.add('modal-record__close');
victoryNewGame.innerHTML = 'Try again';

victoryBtns.append(victoryContinue, victoryNewGame);

victory.append(span, victoryBtns);
