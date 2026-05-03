// Age Calculator - script.js

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.classList.add('show');
  document.getElementById('result').classList.remove('show');
}

function clearError() {
  const el = document.getElementById('error');
  el.textContent = '';
  el.classList.remove('show');
}

function animateNumber(el, target) {
  const duration = 600;
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function calculate() {
  clearError();

  const dayVal   = parseInt(document.getElementById('day').value);
  const monthVal = parseInt(document.getElementById('month').value);
  const yearVal  = parseInt(document.getElementById('year').value);

  // --- Validation ---
  if (!dayVal || !monthVal || !yearVal) {
    showError('Please fill in all three fields.');
    return;
  }

  if (yearVal < 1900 || yearVal > 2025) {
    showError('Please enter a year between 1900 and 2025.');
    return;
  }

  if (dayVal < 1 || dayVal > 31) {
    showError('Please enter a valid day between 1 and 31.');
    return;
  }

  // Check real date validity (e.g. Feb 30 doesn't exist)
  const dob = new Date(yearVal, monthVal - 1, dayVal);
  if (
    dob.getFullYear() !== yearVal ||
    dob.getMonth()    !== monthVal - 1 ||
    dob.getDate()     !== dayVal
  ) {
    showError('This date doesn\'t exist. Please check your input.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dob > today) {
    showError('Date of birth cannot be in the future.');
    return;
  }

  // --- Age Calculation ---
  let years  = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth()    - dob.getMonth();
  let days   = today.getDate()     - dob.getDate();

  if (days < 0) {
    months--;
    // Days in the previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // --- Display Result ---
  const resBox = document.getElementById('result');
  resBox.classList.remove('show');

  // Re-trigger animation by forcing reflow
  void resBox.offsetWidth;
  resBox.classList.add('show');

  animateNumber(document.getElementById('r-years'),  years);
  animateNumber(document.getElementById('r-months'), months);
  animateNumber(document.getElementById('r-days'),   days);

  // Date of birth line
  document.getElementById('dob-display').textContent =
    `Born on ${monthNames[monthVal - 1]} ${dayVal}, ${yearVal}`;

  // Next birthday countdown
  const nextBday = new Date(today.getFullYear(), monthVal - 1, dayVal);
  if (nextBday <= today) nextBday.setFullYear(today.getFullYear() + 1);

  const msLeft   = nextBday - today;
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  const bdayEl   = document.getElementById('next-bday');

  if (daysLeft === 0) {
    bdayEl.innerHTML = '🎂 Happy Birthday!';
  } else {
    bdayEl.innerHTML = `Next birthday in <span>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</span>`;
  }
}

// Allow Enter key to trigger calculation
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') calculate();
});
