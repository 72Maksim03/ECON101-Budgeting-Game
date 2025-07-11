let month = 1;
let week = 1;
let salary = 2000;
let balance = 2000;
let debt = 0;
let health = 100;
let entertainment = 100;
let housing = null;
let transport = null;
let rentPaidThisMonth = false;
let investmentAmount = 0;
let investmentReturn = 0;
let debtWeeks = 0;
let debtTakenThisCycle = false;
let ownedCars = { used: false, new: false };

// Shop Purchases
let gymActive = false;
let streamingActive = false;
let hasPet = false;

const gymMonthlyCost = 20;
const streamingMonthlyCost = 15;

const weeklyEvents = [
  { text: "🔥 You dropped your phone. Repair costs $100", balance: -100 },
  { text: "🎁 Found a freelance gig. You earn $200!", balance: 200 },
  { text: "💊 Minor illness. Health -10", health: -10 },
  { text: "🎉 You attended a free concert. Entertainment +20", entertainment: 20 },
  { text: "💸 Paid extra fees unexpectedly. -$150", balance: -150 },
  { text: "🧘 You had a relaxing week. Health +10", health: 10 },
];

const housingOptions = {
  small: { cost: 600, entertainmentDrop: 8 },
  standard: { cost: 800, entertainmentDrop: 6 },
  luxury: { cost: 1200, entertainmentDrop: 1 },
};

const transportOptions = {
  public: { cost: 100, entertainmentDrop: 4, maintenance: 0, purchasePrice: 0 },
  used: { cost: 200, entertainmentDrop: 3, maintenance: 50, purchasePrice: 3000 },
  new: { cost: 400, entertainmentDrop: -1, maintenance: 20, purchasePrice: 8000 },
};

function chooseHousing(option, el) {
  housing = housingOptions[option];
  highlightChoice("housing-options", el);
  log(`🏠 Chose ${option} housing`);
  updateDisplay();
}

function chooseTransport(option, el) {
  if (option === "public") {
    transport = transportOptions.public;
    highlightChoice("transport-options", el);
    log(`🚗 Using public transport`);
    updateDisplay();
    return;
  }
  if (!ownedCars[option]) {
    const price = transportOptions[option].purchasePrice;
    if (balance >= price) {
      balance -= price;
      ownedCars[option] = true;
      transport = transportOptions[option];
      highlightChoice("transport-options", el);
      alert(`🚗 Bought ${option} car for $${price}`);
      updateDisplay();
    } else {
      alert(`❌ Not enough money to buy ${option} car`);
      return;
    }
  } else {
    transport = transportOptions[option];
    highlightChoice("transport-options", el);
    log(`🚗 Selected owned ${option} car`);
    updateDisplay();
  }
}

function highlightChoice(id, selectedEl) {
  const container = document.getElementById(id);
  [...container.children].forEach((child) => child.classList.remove("selected"));
  selectedEl.classList.add("selected");
}

function buyGym() {
  if (!gymActive) {
    if (balance >= gymMonthlyCost) {
      gymActive = true;
      balance -= gymMonthlyCost;
      log("🏋️ Gym membership bought");
      updateDisplay();
    } else {
      alert("Not enough money for Gym membership!");
    }
  } else {
    alert("You already have Gym membership.");
  }
}

function buyStreaming() {
  if (!streamingActive) {
    if (balance >= streamingMonthlyCost) {
      streamingActive = true;
      balance -= streamingMonthlyCost;
      log("📺 Streaming subscription bought");
      updateDisplay();
    } else {
      alert("Not enough money for Streaming subscription!");
    }
  } else {
    alert("You already have Streaming subscription.");
  }
}

function entertain() {
  if (balance >= 100) {
    balance -= 100;
    entertainment = Math.min(100, entertainment + 20);
    log("🎭 You had fun!");
  } else {
    alert("Not enough money for entertainment.");
  }
  updateDisplay();
}

function goToHospital() {
  if (balance >= 500) {
    balance -= 500;
    health = Math.min(100, health + 40);
    log("💉 Hospital visit!");
  } else {
    alert("Not enough money for hospital visit.");
  }
  updateDisplay();
}

function invest() {
  if (balance >= 200) {
    balance -= 200;
    investmentAmount += 200;
    investmentReturn = Math.floor(investmentAmount * 0.08);
    log(`💹 Invested $200. Return: $${investmentReturn}`);
  } else {
    alert("Not enough money to invest.");
  }
  updateDisplay();
}

function takeLoan() {
  balance += 500;
  debt += 500;
  debtTakenThisCycle = true;
  debtWeeks = 0;
  log("💸 Took a $500 loan");
  updateDisplay();
}

function payLoan() {
  if (balance >= 100 && debt >= 100) {
    balance -= 100;
    debt -= 100;
    log("💵 Paid $100 loan");
  } else {
    alert("Not enough money to pay loan or no debt.");
  }
  updateDisplay();
}

function applyInterest() {
  if (debt > 0 && !debtTakenThisCycle && debtWeeks >= 2) {
    const interest = Math.floor(debt * 0.1);
    debt += interest;
    alert(`💰 Interest added: $${interest}`);
    log(`💰 Interest added`);
    debtWeeks = 0;
  }
}

function deductMonthlySubscriptions() {
  if (gymActive) {
    if (balance >= gymMonthlyCost) {
      balance -= gymMonthlyCost;
      log(`🏋️ Gym monthly fee paid: $${gymMonthlyCost}`);
    } else {
      alert("Not enough money to pay Gym membership! It has been canceled.");
      gymActive = false;
    }
  }
  if (streamingActive) {
    if (balance >= streamingMonthlyCost) {
      balance -= streamingMonthlyCost;
      log(`📺 Streaming monthly fee paid: $${streamingMonthlyCost}`);
    } else {
      alert("Not enough money to pay Streaming subscription! It has been canceled.");
      streamingActive = false;
    }
  }
  if (hasPet) {
    if (balance >= 50) {
      balance -= 50;
      log("🐶 Pet monthly cost paid: $50");
    } else {
      alert("Not enough money to care for pet! It has run away.");
      hasPet = false;
    }
  }
}

function triggerWeeklyEvent() {
  if (Math.random() < 0.25) {
    const event = weeklyEvents[Math.floor(Math.random() * weeklyEvents.length)];
    if (event.balance) balance += event.balance;
    if (event.health) health = Math.max(0, health + event.health);
    if (event.entertainment) entertainment = Math.min(100, entertainment + event.entertainment);
    alert(event.text);
    log(event.text);
  }
}

function nextWeek() {
  if (!housing || !transport) return alert("Choose housing & transport first");

  if (week === 1) {
    deductMonthlySubscriptions();
    payRent();
    payTransport();
    balance += salary;
    if (investmentReturn > 0) balance += investmentReturn;
    log(`💼 Salary: $${salary}`);
  }

  if (gymActive) health = Math.min(100, health + 5);
  if (streamingActive) entertainment = Math.min(100, entertainment + 5);
  if (hasPet) entertainment = Math.min(100, entertainment + 10);

  entertainment -= housing.entertainmentDrop;
  entertainment -= transport.entertainmentDrop;

  if (entertainment < 0) entertainment = 0;
  if (entertainment < 50) health -= 5;
  if (health < 20) {
    balance -= 500;
    salary = Math.max(1000, salary - 500);
    health += 20;
    alert("🚨 Critical health! Forced hospital");
    log("🚨 Hospital visit forced");
  }

  if (!rentPaidThisMonth) {
    alert("🏚️ Missed rent. Game Over.");
    return endGame();
  }

  debtWeeks++;
  if (!debtTakenThisCycle && debtWeeks >= 2) applyInterest();
  debtTakenThisCycle = false;

  if (debt > 2000) {
    alert("💥 Game Over: Debt > $2000");
    return endGame();
  }

  triggerWeeklyEvent();

  week++;
  if (week > 4) {
    week = 1;
    month++;
    rentPaidThisMonth = false;
  }

  if (month > 12) {
    alert("🎉 Game Complete!");
    return endGame();
  }

  updateDisplay();
}

function payRent() {
  if (balance >= housing.cost) {
    balance -= housing.cost;
    rentPaidThisMonth = true;
    log(`🏠 Rent paid: $${housing.cost}`);
  } else rentPaidThisMonth = false;
}

function payTransport() {
  const { cost, maintenance } = transport;
  if (balance >= cost) balance -= cost;
  else debt += cost;
  if (maintenance && balance >= maintenance) balance -= maintenance;
  else if (maintenance) debt += maintenance;
}

function updateDisplay() {
  document.getElementById("month").textContent = month;
  document.getElementById("week").textContent = week;
  document.getElementById("salary").textContent = salary;
  document.getElementById("balance").textContent = balance;
  document.getElementById("debt").textContent = debt;
  document.getElementById("health").textContent = health;
  document.getElementById("entertainment").textContent = entertainment;
  document.getElementById("invested").textContent = investmentAmount;
  document.getElementById("investment-return").textContent = investmentReturn;
}

function log(message) {
  const el = document.getElementById("event-log");
  const logs = el.querySelectorAll("p");
  if (logs.length >= 5) el.removeChild(logs[0]);
  const entry = document.createElement("p");
  entry.textContent = message;
  el.appendChild(entry);
}

function endGame() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  log("Game over.");
}

updateDisplay();
