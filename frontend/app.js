const startups = [
  { name: 'Startup 1' },
  { name: 'Startup 2' },
  { name: 'Startup 3' },
  { name: 'Startup 4' },
  { name: 'Startup 5' },
  { name: 'Startup 6' },
  { name: 'Startup 7' },
  { name: 'Startup 8' },
  { name: 'Startup 9' },
  { name: 'Startup 10' }
];

let totalCoins = 1000;

const form = document.getElementById('investmentForm');
const startupsDiv = document.getElementById('startups');
const remainingCoinsDiv = document.getElementById('remainingCoins');
const thankYouDiv = document.getElementById('thankYou');

startups.forEach((startup, index) => {
  const div = document.createElement('div');
  div.classList.add('startup');
  div.innerHTML = `
    <label>${startup.name}</label><br>
    <input type="number" id="startup${index}" value="0" min="0">
  `;
  startupsDiv.appendChild(div);
});

form.addEventListener('input', updateRemainingCoins);
form.addEventListener('submit', submitInvestment);

function updateRemainingCoins() {
  let used = 0;
  startups.forEach((_, index) => {
    used += parseInt(document.getElementById(`startup${index}`).value) || 0;
  });

  const remaining = totalCoins - used;
  remainingCoinsDiv.innerText = `Remaining Coins: ${remaining}`;

  document.getElementById('submitBtn').disabled = remaining < 0 || remaining > totalCoins;
}

function submitInvestment(e) {
  e.preventDefault();

  let investment = {};
  startups.forEach((startup, index) => {
    investment[startup.name] = parseInt(document.getElementById(`startup${index}`).value) || 0;
  });

  fetch('/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(investment)
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    form.style.display = 'none';
    thankYouDiv.style.display = 'block';
  });
}
