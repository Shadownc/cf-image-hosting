//使用jwt校验登录，请降低hono的版本到3.11.11后使用
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { Home } from "./Home";
import { Admin } from "./Admin";
import { Login } from "./Login";
const secret = 'IMyself'
let IMyselfToken = null

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

const app = new Hono<{ Bindings: { API_HOST: string, USERNAME: string, PASSWORD: string } }>();

app.get("/", (c) => c.html(<Home />));
app.get("/admin", (c) => c.html(<Admin />));
app.get("/login", (c) => c.html(<Login />));

app.post("/login", async (c) => {
  const body = await c.req.json();
  const username = body.username
  const password = body.password

  if (username === c.env.USERNAME && password === c.env.PASSWORD) {
    const tokenPayload = {
      sub: 'login-token',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 120, // Token expires in 2 hours
    }
    IMyselfToken = await sign(tokenPayload, secret)
    return c.json({ code: 200 }, 200);
  } else {
    throw new HTTPException(401, { message: '登录失败' })
  }
});

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
  console.log(`https://api.moderatecontent.com/moderate/?key=${c.env.ModerateContentApiKey}&url=${c.env.API_HOST + data[0].src}`);
  const moderateContentResponse = await fetch(`https://api.moderatecontent.com/moderate/?key=${c.env.ModerateContentApiKey}&url=${c.env.API_HOST + data[0].src}`)
  const moderateContentData = await moderateContentResponse.json()
  console.log(moderateContentData);
  if (moderateContentData.rating_index == 3) {
    return c.json({ code: 500, message: '图片包含成人内容' }, status);
  } else {
    console.log(c.env);
    await c.env.file_url.put(url, data[0].src);
    return c.json(data, status);
  }
});

app.get("/file/:name", async (c) => {
  const response = await fetch(`${c.env.API_HOST}/file/${c.req.param("name")}`);
  return c.newResponse(response.body as ReadableStream, {
    headers: response.headers,
  });
});

app.get("/list", async (c) => {
  const decodedPayload = await verify(IMyselfToken, secret)
  if (IMyselfToken&&decodedPayload) {
    console.log(c.env);
    let data = [];
    const value = await c.env.file_url.list();
    for (const item of value.keys) {
      const info = await c.env.file_url.get(item.name);
      data.push({ key: item.name, url: info });
    }
    return c.json({ code: 200, data }, 200);
  } else {
    throw new HTTPException(401, { message: '身份校验失败' })
  }
});
app.get("/del/:key", async (c) => {
  const value = await c.env.file_url.delete(c.req.param("key"));
  if (!value) {
    return c.json({ code: 200, message: '删除成功' }, 200);
  }
});

app.onError((error, c) => {
  return c.json(
    { code: 500, message: error?.message || "Server internal error" },
    500,
  );
});

export default app;