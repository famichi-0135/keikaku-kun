//フォーム要素を取得
const form = document.getElementById("submit");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const goalInput = document.getElementById("plan");
  const goal = goalInput.value;
  console.log(goal);
  //サーバーに対してデータを送信する。
  sendGoalData(goal);
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
