const calculator = document.querySelector('.calculator');
let amound = 2000;
let period = 5;
let percent = 4.95; 
let payment = "bank";
let diffDate = 1;

const initRangeTrack = (rangeInput) => {
  const rangeBlock = rangeInput.closest('.range');
  const track = rangeBlock.querySelector('.range__track');
  const min = rangeInput.getAttribute('min');
  const max = rangeInput.getAttribute('max');

  const width = (rangeInput.value - min) / (max - min) * 100;

  track.style.width = `${width}%`;
}

const initPercent = () => {
  if (payment === "cash" && diffDate > 3) {
    percent = 6.3;
  } else if (payment === "bank" && diffDate > 3) {
    percent = 6.8;
  } else if (payment === "cash" && diffDate <= 3) {
    percent = 4.45;
  } else {
    percent = 4.95;
  }
  calculator.querySelector('.calculator__percent').textContent = `${percent}%`;
}

const initResult = () => {
  const resultPayment = calculator.querySelector('.calculator__result-payment');
  const resultBorrowing = calculator.querySelector('.calculator__result-borrowing');
  const resultRepay = calculator.querySelector('.calculator__result-repay');

  const monthlyPercent = percent / 100 / 12;

  const payMonthly = Number(amound) * monthlyPercent * Math.pow((1 + monthlyPercent), Number(period) * 12) /(Math.pow((1 + monthlyPercent), Number(period) * 12) - 1);
  const repay = payMonthly * period * 12;

  resultPayment.textContent = Number(payMonthly).toLocaleString('en', { style: "currency", currency: "GBP" });
  resultBorrowing.textContent = Number(amound).toLocaleString('en', { style: "currency", currency: "GBP" });
  resultRepay.textContent = Number(repay).toLocaleString('en', { style: "currency", currency: "GBP" });
}

flatpickr(".flatpickr", {
  wrap: true, 
  minDate: new Date().fp_incr(30), 
  disableMobile: true, 
  dateFormat: "d / m / Y",
  parseDate: true,
  onChange: (dateStr) => {
    diffDate = (Date.parse(dateStr) - Date.now()) / 1000 / 60 / 60 / 24 / 30;
    initPercent();
    initResult();
  }
});

const initCalculator = () => {
  if (!calculator) {
    return;
  }

  initResult();

  const amoundRange = calculator.querySelector('#amound'); 
  const periodRange = calculator.querySelector('#period');
  initRangeTrack(amoundRange);
  initRangeTrack(periodRange);

  amoundRange.addEventListener('input', () => {
    amound = amoundRange.value;
    initRangeTrack(amoundRange);
    calculator.querySelector('.calculator__amound').textContent = Number(amound).toLocaleString('en', { style: "currency", currency: "GBP" })
    initResult();
  });

  periodRange.addEventListener('input', () => {
    period = periodRange.value;
    initRangeTrack(periodRange)
    calculator.querySelector('.calculator__period').textContent = period === "1" ? `${period} year` : `${period} years`;
    initResult();
  });

  document.addEventListener('click', (evt) => {
    if(evt.target.closest('.calculator__deposit')) {
      payment = evt.target.closest('.calculator__deposit').querySelector('input[name="deposit"]:checked').value;
      initPercent();    
      initResult();
    }
  })
}

initCalculator();
