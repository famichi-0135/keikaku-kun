globalThis.onload = (event) => {
  const selectGoal = new URL(
    decodeURIComponent(document.location.href)
  ).searchParams.get("goal");
  console.log(selectGoal);
  const plan = getPlan(selectGoal);
  console.log("onloadのplan" + plan);
  const goal = getGoals(selectGoal);
  console.log("onloadのgoal" + plan);
  createCard(plan);
  appendPull(goal, selectGoal);
  changeSelector();
  // event.preventDefault();
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
  let correctPlan;
  for (const plan of allPlan) {
    // console.log("Key:", plan.key, "Value:", plan.value);
    if (plan.key[1] === goal) {
      correctPlan = plan.value.plan;
    }
  }

  return correctPlan;
}

async function getGoals(goal) {
  // const goalList = ["テスト", "筋トレ", "資格"];
  // return goalList;
  const res = await fetch("get-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const allPlan = await res.json();
  for (const plan of allPlan) {
    if (plan.key[1] === goal) {
      return plan.key[1];
    }
  }
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
