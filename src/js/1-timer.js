import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  startButton: document.querySelector('button[data-start]'),
  dataDays: document.querySelector('span[data-days]'),
  dataHours: document.querySelector('span[data-hours]'),
  dataMinutes: document.querySelector('span[data-minutes]'),
  dataSeconds: document.querySelector('span[data-seconds]'),
  form: document.querySelector('.timer'),
};
let selectedDatesCounter;
let operationsFlag = false;
let unformattingDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (!operationsFlag) {
      const dateNow = new Date();
      console.log(selectedDates[0] - dateNow);
      selectedDatesCounter = selectedDates[0];
      if (selectedDates[0] - dateNow < 0) {
        window.alert('Please choose a date in the future');
        refs.startButton.setAttribute('disabled', true);
      } else {
        refs.startButton.removeAttribute('disabled');
      }
    }
  },
};
const flatpickrObject = flatpickr('#datetime-picker', options);

const timerStarter = () => {
  const timerId = setInterval(() => {
    if (selectedDatesCounter - Date.now() > 0) {
      unformattingDate = selectedDatesCounter - Date.now();
      refs.dataDays.textContent = addLeadingZero(
        convertMs(unformattingDate).days
      );
      refs.dataHours.textContent = addLeadingZero(
        convertMs(unformattingDate).hours
      );
      refs.dataMinutes.textContent = addLeadingZero(
        convertMs(unformattingDate).minutes
      );
      refs.dataSeconds.textContent = addLeadingZero(
        convertMs(unformattingDate).seconds
      );
    }
  }, 1000);
};

const startButtonHandler = event => {
  if (!operationsFlag) {
    operationsFlag = true;
    timerStarter();
    refs.startButton.setAttribute('disabled', true);
  } else {
    clearTimeout(timerId);
    timerStarter();
  }
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => {
  return String(value).padStart(2, '0');
};

refs.startButton.setAttribute('disabled', true);
refs.startButton.addEventListener('click', startButtonHandler);
