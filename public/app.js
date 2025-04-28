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

async function getIpAddress() {
  const res = await fetch('https://api64.ipify.org?format=json');
  const data = await res.json();
  return data.ip;
}

async function hasAlreadyVoted(ip) {
  const res = await fetch(`https://hrlknumhkoipmhgbhsqv.supabase.co/rest/v1/ip_log?ip=eq.${ip}`, {
    headers: {
      'apikey': 'DEIN_API_KEY',
      'Authorization': 'Bearer DEIN_API_KEY'
    }
  });
  const data = await res.json();

  if (data.length === 0) {
    // Wenn die IP NICHT in Supabase existiert => LocalStorage löschen
    localStorage.removeItem('hasVoted');
    return false;
  }

  return true;
}

async function submitInvestment(e) {
  e.preventDefault();

  const ip = await getIpAddress();
  const alreadyVoted = await hasAlreadyVoted(ip);

  if (alreadyVoted || localStorage.getItem('hasVoted')) {
    alert('You have already voted!');
    return;
  }

  let investment = {};
  startups.forEach((startup, index) => {
    investment[startup.name] = parseInt(document.getElementById(`startup${index}`).value) || 0;
  });

  // Votes speichern
  const votePromises = Object.entries(investment).map(([startup, coins]) => {
    if (coins > 0) {
      return fetch('https://hrlknumhkoipmhgbhsqv.supabase.co/rest/v1/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          startup: startup,
          investment: coins,
          ip: ip,
          timestamp: new Date().toISOString()
        })
      });
    }
  });

  await Promise.all(votePromises);  // warten bis alle Investments gespeichert sind

  // IP Log speichern
  await fetch('https://hrlknumhkoipmhgbhsqv.supabase.co/rest/v1/ip_log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'DEIN_API_KEY',
      'Authorization': 'Bearer DEIN_API_KEY',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      ip: ip,
      timestamp: new Date().toISOString()
    })
  });

  localStorage.setItem('hasVoted', 'true');
  form.style.display = 'none';
  thankYouDiv.style.display = 'block';
}
