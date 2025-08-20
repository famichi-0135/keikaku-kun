globalThis.onload = (event) => {
  const selectGoal = new URL(
    decodeURIComponent(document.location.href)
  ).searchParams.get("goal");
  console.log(selectGoal);
  const plan = getPlan(selectGoal);
  const goals = getGoals();
  createCard(plan);
  appendPull(goals, selectGoal);
  changeSelector();
  // event.preventDefault();
};

function getPlan(params) {
  const mockPlan = [
    { title: "第一章を勉強する", deadline: "2025-08-24" },
    { title: "第二章を勉強する", deadline: "2025-08-25" },
    { title: "第三章を勉強する", deadline: "2025-08-26" },
    { title: "第四章を勉強する", deadline: "2025-08-27" },
    { title: "第五章を勉強する", deadline: "2025-08-28" },
  ];

  // console.log(params);
  return mockPlan;
}

function getGoals() {
  const goalList = ["テスト", "筋トレ", "資格"];
  return goalList;
}

function createCard(plan) {
  const cardDiv = document.getElementById("card");
  for (let i = 0; i < plan.length; i++) {
    const card = document.createElement("div");
    card.id = `num${i}`;
    const pTitle = document.createElement("p");
    const pDeadline = document.createElement("p");
    pTitle.innerHTML = `${plan[i].title}`;
    pDeadline.innerHTML = `${plan[i].deadline}`;
    card.appendChild(pTitle);
    card.appendChild(pDeadline);
    cardDiv.appendChild(card);
  }
}

function appendPull(goals, selectGoal) {
  const selector = document.getElementById("plan-select");
  for (let i = 0; i < goals.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = goals[i];
    //今選んでるやつにselectedを付ける
    if (goals[i] === selectGoal) {
      option.selected = true;
    }
    selector.appendChild(option);
  }
}

function changeSelector() {
  const selector = document.getElementById("plan-select");
  selector.addEventListener("change", (event) => {
    const selectGoal = event.target[event.target.value].text;
    // console.log(selectGoal);

    location.href = `/plan.html?goal=${selectGoal}`;
  });
}
