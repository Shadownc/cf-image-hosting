import { Hono } from "hono";
import { cors } from "hono/cors";
import { Home } from "./Home";
import { Admin } from "./Admin";

async function randomString(len) { //随机链接生成
  len = len || 6;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

const app = new Hono<{ Bindings: { API_HOST: string } }>();

app.get("/", (c) => c.html(<Home />));
app.get("/admin", (c) => c.html(<Admin />));

app.post("/upload", cors(), async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  const formData = new FormData();
  formData.append("file", file, file.name);
  const response = await fetch(`${c.env.API_HOST}/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  const status = response.status as Parameters<typeof c.json>[1];
  let url = await randomString()
  console.log(c.env);
  await c.env.file_url.put(url, data[0].src);
  return c.json(data, status);
});

app.get("/file/:name", async (c) => {
  const response = await fetch(`${c.env.API_HOST}/file/${c.req.param("name")}`);
  return c.newResponse(response.body as ReadableStream, {
    headers: response.headers,
  });
});

app.get("/list", async (c) => {
  console.log(c.env);
  let data = [];
  const value = await c.env.file_url.list();
  for (const item of value.keys) {
    const info = await c.env.file_url.get(item.name);
    data.push({ url: info });
  }
  return c.json({ code: 200, data }, 200);
});


app.onError((error, c) => {
  return c.json(
    { code: 500, message: error?.message || "Server internal error" },
    500,
  );
});

export default app;
