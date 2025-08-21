import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { GoogleGenAI } from "npm:@google/genai@1.15.0";

const ai = new GoogleGenAI({});
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }

  //post処理 DenoKV利用
  if (req.method === "POST" && pathname === "/create-plan") {
    const body = await req.json();
    const prompt = body.prompt;
    console.log(prompt);
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `「${prompt}」の目標をもとにその目標を達成するための計画を作成して。絶対にjson以外は出力しないこと、コードブロック形式にもしないこと、形式としては[{title:string,deadline:yyyy-mm-dd}]の形でtitleには計画を出力すること、deadlineは最新の日時を調べてそこから始めること`,
    });
    const plan = res.text;
    console.log(plan);
    const result = await kv.set(["goal", `${prompt}`], {
      plan: JSON.parse(plan),
    });
    // console.log(result);
    return new Response(plan);
  }

  //get処理
  if (req.method === "GET" && pathname === "/get-plan") {
    //DBから取り出す処理
    const KvListIterator = await kv.list({ prefix: [] });
    const allPlan = [];
    //jsonの配列にする処理
    for await (const kv of KvListIterator) {
      allPlan.push({ key: kv.key, value: JSON.parse(kv.value) });
    }
    console.log(allPlan);
    return new Response(JSON.stringify(allPlan), { headers: {"Content-Type":"application/json"}});
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
