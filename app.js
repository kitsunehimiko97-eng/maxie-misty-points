const tasks = [
  {
    id: "meds",
    name: "Wzięcie leków",
    icon: "💊",
    points: 1
  },
  {
    id: "teethMorning",
    name: "Umycie zębów — rano",
    icon: "🪥",
    points: 1
  },
  {
    id: "teethEvening",
    name: "Umycie zębów — wieczorem",
    icon: "🪥",
    points: 1
  },
  {
    id: "catMorning",
    name: "Nakarmienie kota — rano",
    icon: "🐈",
    points: 1
  },
  {
    id: "catEvening",
    name: "Nakarmienie kota — wieczorem",
    icon: "🐈",
    points: 1
  },
  {
    id: "meal",
    name: "Zrobienie posiłku",
    icon: "🍳",
    points: 1
  },
  {
    id: "shower",
    name: "Umycie się",
    icon: "🚿",
    points: 1.5
  },
  {
    id: "laundry",
    name: "Zrobienie prania",
    icon: "🧺",
    points: 1.5
  },
  {
    id: "litter",
    name: "Wyczyszczenie kuwety",
    icon: "🐈‍⬛",
    points: 1.5
  },
  {
    id: "dishes",
    name: "Zrobienie naczyń",
    icon: "🍽️",
    points: 2
  },
  {
    id: "shopping",
    name: "Większe zakupy do domu",
    icon: "🛒",
    points: 2
  }
];

let selectedPerson = "Maxie";

let data = JSON.parse(
  localStorage.getItem("maxieMistyPoints")
) || {
  Maxie: {
    points: 0,
    completed: {}
  },
  Misty: {
    points: 0,
    completed: {}
  }
};function selectPerson(person) {
  selectedPerson = person;

  document
    .getElementById("maxieButton")
    .classList.toggle("active", person === "Maxie");

  document
    .getElementById("mistyButton")
    .classList.toggle("active", person === "Misty");

  render();
}

function triggerTaskBurst(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const burst = document.createElement("div");
  burst.className = `task-burst task-burst-${selectedPerson.toLowerCase()}`;

  const emojis = selectedPerson === "Maxie"
    ? ["🐷", "✨", "💗", "🎀", "🌸", "🍓"]
    : ["🦇", "⚡", "🦸", "💥", "🌙", "🛡️"];

  for (let i = 0; i < 14; i += 1) {
    const piece = document.createElement("span");
    piece.className = "burst-piece";
    piece.textContent = emojis[i % emojis.length];
    piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 180}px`);
    piece.style.setProperty("--dy", `${-20 - Math.random() * 150}px`);
    piece.style.setProperty("--rot", `${(Math.random() - 0.5) * 320}deg`);
    piece.style.setProperty("--delay", `${(Math.random() * 0.15).toFixed(2)}s`);
    burst.appendChild(piece);
  }

  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;

  document.body.appendChild(burst);

  setTimeout(() => burst.remove(), 900);
}

function toggleTask(task, event) {
  const personData = data[selectedPerson];

  if (personData.completed[task.id]) {
    delete personData.completed[task.id];
    personData.points -= task.points;

    save();

    if (event) {
      triggerTaskBurst(event);
    }

    showToast(`-${task.points} ⭐`);

    render();
    return;
  }

  personData.completed[task.id] = true;
  personData.points += task.points;

  save();

  if (event) {
    triggerTaskBurst(event);
  }

  showToast(`+${task.points} ⭐`);

  render();
}

function save() {
  localStorage.setItem(
    "maxieMistyPoints",
    JSON.stringify(data)
  );
}

function renderTasks() {
  const container = document.getElementById("tasks");

  container.innerHTML = "";

  const personData = data[selectedPerson];

  tasks.forEach(task => {
    const done = personData.completed[task.id];

    const element = document.createElement("div");
    element.className = `task ${done ? "done" : ""}`;

    const taskLeft = document.createElement("div");
    taskLeft.className = "task-left";

    const taskIcon = document.createElement("div");
    taskIcon.className = "task-icon";
    taskIcon.textContent = task.icon;

    const textWrap = document.createElement("div");

    const taskName = document.createElement("div");
    taskName.className = "task-name";
    taskName.textContent = task.name;

    const taskPoints = document.createElement("div");
    taskPoints.className = "task-points";
    taskPoints.textContent = `+${task.points} pkt`;

    textWrap.append(taskName, taskPoints);
    taskLeft.append(taskIcon, textWrap);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = done ? "✓" : "+";
    button.addEventListener("click", event => toggleTask(task, event));

    element.append(taskLeft, button);
    container.appendChild(element);
  });
}

function updateCounters() {

  const maxie = data.Maxie.points;
  const misty = data.Misty.points;
  const total = maxie + misty;

  document.getElementById("maxiePoints")
    .textContent = formatPoints(maxie);

  document.getElementById("mistyPoints")
    .textContent = formatPoints(misty);

  document.getElementById("totalPoints")
    .textContent = formatPoints(total);

  document.getElementById("statsTotal")
    .textContent = formatPoints(total);

  const today = Object.keys(
    data[selectedPerson].completed
  ).reduce((sum, id) => {

    const task = tasks.find(t => t.id === id);

    return sum + (task ? task.points : 0);

  }, 0);

  document.getElementById("todayPoints")
    .textContent = `${formatPoints(today)} pkt`;

  const completed =
    Object.keys(data.Maxie.completed).length +
    Object.keys(data.Misty.completed).length;

  document.getElementById("completedTasks")
    .textContent = completed;
}

function formatPoints(number) {
  return Number.isInteger(number)
    ? number
    : number.toFixed(1);
}

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1200);
}

function resetData() {

  const confirmation = confirm(
    "Na pewno chcesz wyzerować wszystkie punkty?"
  );

  if (!confirmation) return;

  data = {
    Maxie: {
      points: 0,
      completed: {}
    },

    Misty: {
      points: 0,
      completed: {}
    }
  };

  save();

  render();
}

function render() {
  renderTasks();
  updateCounters();
}

render();