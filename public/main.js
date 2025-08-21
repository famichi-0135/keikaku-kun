//フォーム要素を取得
const form = document.getElementById("submit");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const goalInput = document.getElementById("plan");
  const goal = goalInput.value;
  console.log(goal);
  //サーバーに対してデータを送信する。
  await sendGoalData(goal);
  location.href = `/plan.html?goal=${goal}`;
});

async function sendGoalData(goal) {
  //後でサーバへのデータ送信処理を作る。
  const res = await fetch("/create-plan", {
    method: "POST",
    body: JSON.stringify({
      prompt: `${goal}`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const plan = await res.json();
  console.log(plan);
  return plan;
}

// const planButton = document.getElementById("plan-button");
// planButton.addEventListener("click", async (event) => {
//   event.preventDefault();
//   const res = await fetch("/get-plan");
//   const allPlan = await res.json();
//   const firstGoal = allPlan[0].key[1];
//   console.log("計画ボタン"+firstGoal);
//   location.href = `/plan.html?goal=${firstGoal}`;
// });
