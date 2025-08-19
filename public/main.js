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
}

// function getPlan(params) {
//   const mockPlan = [
//     { title: "第一章を勉強する", deadline: "2025-08-24" },
//     { title: "第二章を勉強する", deadline: "2025-08-25" },
//     { title: "第三章を勉強する", deadline: "2025-08-26" },
//     { title: "第四章を勉強する", deadline: "2025-08-27" },
//     { title: "第五章を勉強する", deadline: "2025-08-28" },
//   ];
//   console.log(params);
//   return mockPlan;
// }
