globalThis.onload = async () => {
  const selectGoal = new URL(document.location.href).searchParams.get("goal");
  console.log(selectGoal);
  // const escapeSelectGoal = decodeURIComponent(selectGoal);
  //計画を取得
  const plan = await getPlan(selectGoal);
  console.log("onloadのplan" + plan);
  //目標を取得
  const goals = await getGoals();
  console.log("onloadのgoal" + goals);
  await createCard(plan, selectGoal);
  appendPull(goals, selectGoal, plan);
  changeSelector();
  if (plan.length === 0 && goals.length !== 0) {
    location.href = `/plan.html?goal=${encodeURIComponent(goals[0])}`;
  }
};

async function getPlan(goal) {
  const res = await fetch("get-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const allPlan = await res.json();
  //Allplanから今のセレクターに選択されているGoalを同じplanを見つける処理
  // let correctPlan;
  for (const plan of allPlan) {
    // console.log("Key:", plan.key, "Value:", plan.value);
    if (plan.key[1] === goal) {
      console.log(plan.value.plan);
      return plan.value.plan;
    }
  }

  // console.log(correctPlan);
  return [];
}

async function getGoals() {
  const res = await fetch("get-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const allPlan = await res.json();
  const allGoals = [];
  for (const plan of allPlan) {
    allGoals.push(plan.key[1]);
  }
  return allGoals;
}

function createCard(plan) {
  // if (plan.length === 0) {
  //   //計画が一つもない場合にセレクトから目標から消す処理
  //   const selector = document.getElementById("plan-select");
  // }
  const cardDiv = document.getElementById("card");
  for (let i = 0; i < plan.length; i++) {
    const button = document.createElement("button");
    button.innerText = "削除";
    button.id = `${i}`;
    button.classList.add("cardBtn");
    const card = document.createElement("div");
    const titleCard = document.createElement("div");
    const deadlineCard = document.createElement("div");
    card.id = `num${i}`;
    titleCard.id = `titleNum${i}`;
    deadlineCard.id = `deadlineNum${i}`;
    const pTitle = document.createElement("p");
    const pDeadline = document.createElement("p");
    pTitle.innerHTML = `${plan[i].title}`;
    pDeadline.innerHTML = `${plan[i].deadline}`;
    const pT = document.createElement("p");
    const pD = document.createElement("p");
    pT.innerHTML = "【計画】";
    pD.innerHTML = "【期日】";
    titleCard.appendChild(pT);
    titleCard.appendChild(pTitle);
    deadlineCard.appendChild(pD);
    deadlineCard.appendChild(pDeadline);
    deadlineCard.appendChild(button);
    card.appendChild(titleCard);
    card.appendChild(deadlineCard);
    // card.appendChild(button);
    cardDiv.appendChild(card);

    button.addEventListener("click", async () => {
      const selectGoal = new URL(document.location.href).searchParams.get(
        "goal"
      );
      const idx = button.id;
      // console.log(idx, selectGoal);
      await fetch("/delete-card", {
        method: "POST",
        body: JSON.stringify({
          goal: `${selectGoal}`,
          idx: idx,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const encodeSelectGoal = encodeURIComponent(selectGoal);
      location.href = `/plan.html?goal=${encodeSelectGoal}`;
    });
  }
}

function appendPull(goals, selectGoal, plan) {
  const selector = document.getElementById("plan-select");
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
  console.log(plan.length);
  console.log(selectGoal);
  console.log(goals);
  for (let i = 0; i < goals.length; i++) {
    const option = document.createElement("option");
    // console.log(goals[i]);
    // console.log(selectGoal);
    option.value = i;
    option.innerHTML = goals[i];
    //今選んでるやつにselectedを付ける
    if (goals[i] === selectGoal) {
      option.selected = true;
    }
    selector.appendChild(option);
  }

  // else {
  //   const encodeGoal = encodeURIComponent(goals[0]);
  //   //ここでキー、ごとデータベースから削除する処理をする
  //   location.href = `/plan.html?goal=${encodeGoal}`;
  // }
}

function changeSelector() {
  const selector = document.getElementById("plan-select");
  selector.addEventListener("change", (event) => {
    const selectGoal = event.target[event.target.value].text;
    // console.log(selectGoal);
    const encodeSelectGoal = encodeURIComponent(selectGoal);
    location.href = `/plan.html?goal=${encodeSelectGoal}`;
  });
}
