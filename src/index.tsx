import { Hono } from "hono";
import { cors } from "hono/cors";
import { Home } from "./Home";
import { Admin } from "./Admin";

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
  return c.json(data, status);
});

app.get("/file/:name", async (c) => {
  const response = await fetch(`${c.env.API_HOST}/file/${c.req.param("name")}`);
  return c.newResponse(response.body as ReadableStream, {
    headers: response.headers,
  });
});

app.get("/list", async (c) => {
  console.log(c.env)
  const value = await c.env.img_url.list();
  console.log(value,'-----');
  return c.json(
    { code: 200, message: value },
    200,
  );
})

app.onError((error, c) => {
  return c.json(
    { code: 500, message: error?.message || "Server internal error" },
    500,
  );
});

export default app;
