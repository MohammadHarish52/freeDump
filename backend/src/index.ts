import { Hono } from "hono";

const app = new Hono();

app.post("/api/v1/signup", (c) => {
  return c.text("signup");
});

app.post("/api/v1/signin", (c) => {
  return c.text("signin");
});

app.post("/api/v1/blog", (c) => {
  return c.text("post a blog");
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get a blog");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("get all blog");
});

app.get("/api/v1/blog/", (c) => {
  return c.text("update the blog");
});

export default app;
