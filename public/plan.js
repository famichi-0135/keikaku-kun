globalThis.onload = () => {
  const goal = new URL(
    decodeURIComponent(document.location.href)
  ).searchParams.get("goal");
  const plan = getPlan(goal);
  createCard(plan);
};

function getPlan(params) {
  const mockPlan = [
    { title: "第一章を勉強する", deadline: "2025-08-24" },
    { title: "第二章を勉強する", deadline: "2025-08-25" },
    { title: "第三章を勉強する", deadline: "2025-08-26" },
    { title: "第四章を勉強する", deadline: "2025-08-27" },
    { title: "第五章を勉強する", deadline: "2025-08-28" },
  ];
  console.log(params);
  return mockPlan;
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
