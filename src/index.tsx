//使用jwt校验登录，请降低hono的版本到3.11.11后使用
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { Home } from "./Home";
import { Admin } from "./Admin";
import { Login } from "./Login";

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

// 添加一个验证中间件
async function authMiddleware(c: Context, next: Next) {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new HTTPException(401, { message: '未登录' });
    }

    try {
      // 验证 token
      const payload = await verify(token, c.env.LOGINSSECRET);
      
      // 检查令牌是否过期
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new HTTPException(401, { message: '登录已过期，请重新登录' });
      }

      // 将验证后的用户信息添加到请求上下文
      c.set('user', payload);
      
      await next();
    } catch (err) {
      throw new HTTPException(401, { message: '无效的登录状态' });
    }
  } catch (err) {
    throw err;
  }
}

// 登录接口
app.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    // 验证用户名和密码
    if (!username || !password) {
      throw new HTTPException(400, { message: '用户名和密码不能为空' });
    }

    if (username === c.env.USERNAME && password === c.env.PASSWORD) {
      // 生成 token
      const twoHours = 2 * 60 * 60; // 2小时，单位：秒
      const exp = Math.floor(Date.now() / 1000) + twoHours;
      
      const tokenPayload = {
        sub: username,
        role: 'admin',
        exp,
        iat: Math.floor(Date.now() / 1000), // 令牌签发时间
      };

      const token = await sign(tokenPayload, c.env.LOGINSSECRET);

      return c.json({
        code: 200,
        data: {
          token,
          expires: exp,
          user: {
            username,
            role: 'admin'
          }
        }
      });
    }

    throw new HTTPException(401, { message: '用户名或密码错误' });
  } catch (error) {
    throw new HTTPException(401, { 
      message: error.message || '登录失败'
    });
  }
});

// 需要验证的接口使用 authMiddleware
app.use("/admin/*", authMiddleware);
app.use("/update/*", authMiddleware);
app.use("/upload", authMiddleware);

// 可选：添加刷新令牌接口
app.post("/refresh-token", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    
    // 生成新的 token
    const twoHours = 2 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + twoHours;
    
    const tokenPayload = {
      sub: user.sub,
      role: user.role,
      exp,
      iat: Math.floor(Date.now() / 1000),
    };

    const newToken = await sign(tokenPayload, c.env.LOGINSSECRET);

    return c.json({
      code: 200,
      data: {
        token: newToken,
        expires: exp
      }
    });
  } catch (error) {
    throw new HTTPException(401, { message: '刷新令牌失败' });
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

    // 暂时存储文件
    await c.env.file_url.put(key, JSON.stringify(fileData));

    // 生成文件的访问 URL
    const fileSrc = `${c.env.API_HOST}/file/${key}`;
    
    // 如果配置了 ModerateContentApiKey，进行内容审核
    if (c.env.ModerateContentApiKey) {
      const moderateContentUrl = `https://api.moderatecontent.com/moderate/?key=${c.env.ModerateContentApiKey}&url=${fileSrc}`;
      console.log(`ModerateContent URL: ${moderateContentUrl}`);

      const moderateContentResponse = await fetch(moderateContentUrl);
      const moderateContentData = await moderateContentResponse.json();
      console.log("ModerateContent API 响应:", moderateContentData);

      // 判断图片内容是否包含成人内容
      if (moderateContentData.rating_index == 3) {
        console.log("图片包含成人内容，删除文件");
        await c.env.file_url.delete(key);
        return c.json({ code: 500, message: '图片包含成人内容' }, 500);
      }
    } else {
      console.log("未配置 ModerateContentApiKey，跳过内容审核");
    }

    // 返回文件的访问 URL
    return c.json({ success: true, url: fileSrc }, 200);
    
  } catch (error) {
    console.error("发生错误:", error);
    return c.json({ code: 500, message: '服务器内部错误', error: error.message || error.toString() }, 500);
  }
});

app.get("/file/:key", async (c) => {
  try {
    const key = c.req.param('key');
    const value = await c.env.file_url.get(key);
    
    if (!value) {
      return c.json({ code: 404, message: '文件不存在' }, 404);
    }

    const fileData = JSON.parse(value);
    const uint8Array = new Uint8Array(fileData.file);

    // 添加缓存控制头
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');
    
    return c.newResponse(uint8Array, 200, {
      'Content-Type': fileData.contentType
    });
  } catch (error) {
    return c.json({ code: 500, message: '服务器内部错误' }, 500);
  }
});


app.get("/list", authMiddleware, async (c) => {
  try {
    let data = [];
    const value = await c.env.file_url.list();
    for (const item of value.keys) {
      const fileUrl = `${c.env.API_HOST}/file/${item.name}`;
      data.push({ key: item.name, url: fileUrl });
    }
    return c.json({ code: 200, data }, 200);
  } catch (error) {
    throw new HTTPException(500, { message: '获取列表失败' });
  }
});

app.get("/del/:key", authMiddleware, async (c) => {
  try {
    await c.env.file_url.delete(c.req.param("key"));
    return c.json({ code: 200, message: '删除成功' }, 200);
  } catch (error) {
    throw new HTTPException(500, { message: '删除失败' });
  }
});

app.use("/list", authMiddleware);
app.use("/del/*", authMiddleware);

app.post("/update/:key", cors(), async (c) => {
  try {
    const key = c.req.param('key');
    const body = await c.req.parseBody();
    const file = body.file;

    if (!file) {
      return c.json({ code: 400, message: '未找到上传的文件' }, 400);
    }

    const fileBuffer = await file.arrayBuffer();
    const contentType = file.type;

    const fileData = {
      contentType: contentType,
      file: Array.from(new Uint8Array(fileBuffer))
    };

    await c.env.file_url.put(key, JSON.stringify(fileData));
    
    const fileSrc = `${c.env.API_HOST}/file/${key}`;
    return c.json({ success: true, url: fileSrc }, 200);
    
  } catch (error) {
    console.error("更新失败:", error);
    return c.json({ code: 500, message: '服务器内部错误' }, 500);
  }
});

app.onError((error, c) => {
  return c.json(
    { code: 500, message: error?.message || "Server internal error" },
    500,
  );
});

export default app;