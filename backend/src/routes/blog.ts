import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blog.post("/api/v1/blog", (c) => {
  return c.text("post a blog");
});

blog.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get a blog");
});

blog.get("/api/v1/blog/bulk", (c) => {
  return c.text("get all blog");
});

blog.get("/api/v1/blog/", (c) => {
  return c.text("update the blog");
});

export default blog;
