//使用jwt校验登录，请降低hono的版本到3.11.11后使用
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { Home } from "./Home";
import { Admin } from "./Admin";
import { Login } from "./Login";
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

const app = new Hono<{ Bindings: { API_HOST: string, USERNAME: string, PASSWORD: string, LOGINSSECRET: string } }>();

app.get("/", (c) => c.html(<Home />));
app.get("/admin", (c) => c.html(<Admin />));
app.get("/login", (c) => c.html(<Login />));

app.post("/login", async (c) => {
  const body = await c.req.json();
  const username = body.username
  const password = body.password

  if (username === c.env.USERNAME && password === c.env.PASSWORD) {
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
    const exp = Math.floor(Date.now() / 1000) + twoHoursInMilliseconds / 1000;
    const tokenPayload = {
      sub: 'login-token',
      role: 'admin',
      exp
    }
    IMyselfToken = await sign(tokenPayload, c.env.LOGINSSECRET)
    return c.json({ code: 200 }, 200);
  } else {
    throw new HTTPException(401, { message: '登录失败' })
  }
});

app.post("/upload", cors(), async (c) => {
  try {
    // 解析上传的文件
    const body = await c.req.parseBody();
    const file = body.file;

    // 检查文件对象是否存在
    if (!file) {
      console.error("未找到文件:", body);
      return c.json({ code: 400, message: '未找到上传的文件' }, 400);
    }

    console.log("上传的文件:", file);

    // 将文件内容转换为 ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // 输出文件长度，确认文件非空
    console.log("文件的长度:", fileBuffer.byteLength);

    // 获取文件类型
    const contentType = file.type;  // 动态获取文件的 MIME 类型

    // 生成随机的键作为文件名
    const key = await randomString();  // 你可以根据自己的逻辑生成唯一文件名

    // 构造要存储的数据，包含二进制文件和 MIME 类型
    const fileData = {
      contentType: contentType,  // 存储文件类型
      file: Array.from(new Uint8Array(fileBuffer))  // 将 ArrayBuffer 转换为数组存储
    };

    console.log("存储到 KV 的数据:", fileData);

    // 暂时存储文件，生成访问 URL 进行鉴黄检查
    await c.env.file_url.put(key, JSON.stringify(fileData));

    // 生成文件的临时访问 URL
    const fileSrc = `${c.env.API_HOST}/file/${key}`;
    console.log("临时存储文件的 URL:", fileSrc);

    // 调用 ModerateContent API 检查图片内容
    const moderateContentUrl = `https://api.moderatecontent.com/moderate/?key=${c.env.ModerateContentApiKey}&url=${fileSrc}`;
    console.log(`ModerateContent URL: ${moderateContentUrl}`);

    // 请求 ModerateContent API
    const moderateContentResponse = await fetch(moderateContentUrl);
    const moderateContentData = await moderateContentResponse.json();
    console.log("ModerateContent API 响应:", moderateContentData);

    // 判断图片内容是否包含成人内容
    if (moderateContentData.rating_index == 3) {
      console.log("图片包含成人内容，删除文件");
      // 删除文件，防止存储不合规的内容
      await c.env.file_url.delete(key);
      return c.json({ code: 500, message: '图片包含成人内容' }, 500);
    } else {
      // 返回文件的访问 URL
      const fileUrl = `${c.env.API_HOST}/file/${key}`;
      return c.json({ success: true, url: fileUrl }, 200);
    }
  } catch (error) {
    console.error("发生错误:", error);
    return c.json({ code: 500, message: '服务器内部错误', error: error.message || error.toString() }, 500);
  }
});

app.get("/file/:name", async (c) => {
  try {
    // 获取文件的名称（或者是键）
    const key = c.req.param("name");

    // 从 KV 获取文件的数据
    const fileData = await c.env.file_url.get(key);

    if (!fileData) {
      console.log("文件不存在:", key);
      return c.json({ code: 404, message: '文件不存在' }, 404);
    }

    // 解析存储的 JSON 数据
    const { contentType, file } = JSON.parse(fileData);

    // 打印文件内容和长度，确保数据正确
    console.log("读取的文件类型:", contentType);
    console.log("读取的文件数据:", file);
    console.log("文件的长度:", file.length);

    // 将文件的数组转换回 Uint8Array
    const bytes = new Uint8Array(file);

    console.log("文件的前 10 个字节:", bytes.slice(0, 10));

    // 返回文件内容，设置正确的 Content-Type
    return new Response(bytes, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("获取文件时发生错误:", error);
    return c.json({ code: 500, message: '服务器内部错误', error: error.message || error.toString() }, 500);
  }
});


app.get("/list", async (c) => {
  const decodedPayload = await verify(IMyselfToken, c.env.LOGINSSECRET)
  if (IMyselfToken && decodedPayload) {
    console.log(c.env);
    let data = [];
    const value = await c.env.file_url.list();
    for (const item of value.keys) {
      // const info = await c.env.file_url.get(item.name);
      const fileUrl = `${c.env.API_HOST}/file/${item.name}`;
      data.push({ key: item.name, url: fileUrl });
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