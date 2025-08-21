import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai@1.15.0";

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
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    console.log(prompt);
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `目標:[${prompt}]を達成するための${year}/${month}/${date}から始める計画を生成してください。各計画には title と deadline を含め、deadline は yyyy-mm-dd 形式にしてください。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
              },
              deadline: {
                type: Type.STRING,
                format: "date", // yyyy-mm-dd 形式を期待
              },
            },
            propertyOrdering: ["title", "deadline"],
            required: ["title", "deadline"],
          },
        },
      },
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
    const KvListIterator = await kv.list({ prefix: ["goal"] });
    const allPlan = [];
    //jsonの配列にする処理
    for await (const kv of KvListIterator) {
      allPlan.push({ key: kv.key, value: kv.value });
    }
    console.log(allPlan);
    return new Response(JSON.stringify(allPlan), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
