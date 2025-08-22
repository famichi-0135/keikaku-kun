//フォーム要素を取得
const form = document.getElementById("submit");

form.addEventListener("submit", async (event) => {
  //ボタンを無効化
  const button = document.querySelector(".submitButton");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  button.disabled = true;
  btnText.innerText = "送信中...";
  spinner.style.display = "inline-block";
  event.preventDefault();
  const goalInput = document.getElementById("plan");
  const goal = goalInput.value;
  console.log(goal);
  //サーバーに対してデータを送信する。
  await sendGoalData(goal);
  btnText.innerText = "送信";
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


