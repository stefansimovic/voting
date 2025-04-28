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

  if (localStorage.getItem('hasVoted')) {
    alert('You have already voted!');
    return;
  }

  let investment = {};
  startups.forEach((startup, index) => {
    investment[startup.name] = parseInt(document.getElementById(`startup${index}`).value) || 0;
  });

  Object.entries(investment).forEach(([startup, coins]) => {
    if (coins > 0) {
      fetch('https://hrlknumhkoipmhgbhsqv.supabase.co/rest/v1/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
          'Prefer': 'return=representation'  // wichtig: damit wir Antwort bekommen
        },
        body: JSON.stringify({
          startup: startup,
          investment: coins,
          timestamp: new Date().toISOString()
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Vote gespeichert:', data);
      })
      .catch(error => {
        console.error('Fehler beim Speichern:', error);
      });      
    }
  });

  localStorage.setItem('hasVoted', 'true');
  form.style.display = 'none';
  thankYouDiv.style.display = 'block';
}

