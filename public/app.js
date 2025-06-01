const startups = [
  { name: '🔬 LabOne' },
  { name: '🚗 Hitch now' },
  { name: '🏠 Tokenisation' },
  { name: '🏋️‍♂️ Agility Plus' },
  { name: '🌱 Cairos' },
  { name: '📞 Telephoneagent' },
  { name: '🔐 Tapgo' },
  { name: '♻️ R3FiL' },
  { name: '🏗️ StrawBrick' },
  { name: '🌸 PCOS Balance' }
];

let totalCoins = 1000;

const form = document.getElementById('investmentForm');
const startupsDiv = document.getElementById('startups');
const remainingCoinsDiv = document.getElementById('remainingCoins');
const thankYouDiv = document.getElementById('thankYou');

// Startups in Formular einfügen
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
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk'
    }
  });
  const data = await res.json();
  return data.length > 0;
}

async function submitInvestment(e) {
  e.preventDefault();

  document.getElementById('submitBtn').disabled = true;

  const ip = await getIpAddress();
  const alreadyVoted = await hasAlreadyVoted(ip);

  // NEUE REIHENFOLGE!
  if (alreadyVoted) {
    alert('You have already voted!');
    return;
  }

  // Falls Supabase nichts gefunden hat: sicherheitshalber localStorage löschen
  localStorage.removeItem('hasVoted');

  if (localStorage.getItem('hasVoted')) {
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

  await Promise.all(votePromises); // Warten bis alle Votes gespeichert sind

  // IP in ip_log Tabelle speichern
  await fetch('https://hrlknumhkoipmhgbhsqv.supabase.co/rest/v1/ip_log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGtudW1oa29pcG1oZ2Joc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDA2OTgsImV4cCI6MjA2MTM3NjY5OH0.1XunVpe3GYlHsGUbHQbJTNWxRBj60_W6poOc0ln-tsk',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      ip: ip,
      timestamp: new Date().toISOString()
    })
  });

  // Setze LocalStorage für Client
  localStorage.setItem('hasVoted', 'true');

  form.style.display = 'none';
  thankYouDiv.style.display = 'block';
}

(async () => {
  const ipPromise = getIpAddress();
  const alreadyVotedPromise = ipPromise.then(ip => hasAlreadyVoted(ip));
  const [ip, alreadyVoted] = await Promise.all([ipPromise, alreadyVotedPromise]);

  if (alreadyVoted) {
    document.querySelector('.container').innerHTML = `
      <h2 style="text-align:center;">You have already voted! 🎉</h2>
      <p style="text-align:center;">Thank you for participating.</p>
    `;
  } else {
    form.style.display = 'block';
  }

  document.getElementById('loading').style.display = 'none';
  document.querySelector('.container').style.display = 'block';
})();

