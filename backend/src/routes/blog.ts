import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  createBlogInput,
  CreateBlogInput,
  updateBlogInput,
} from "@harish_52/freedump-common";

const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// middleware
blog.use("/*", async (c, next) => {
  // getting the token from the header
  const authHeader = c.req.header("authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    //@ts-ignore
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: "Not logged in",
    });
  }
});

// creating the blog
blog.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "wrong inputs",
    });
  }
  const userId = c.get("userId");

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    return c.json({ id: blog.id });
  } catch (error) {
    return c.text("some error occured ");
  }
});

// updating the blog
blog.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "wrong inputs",
    });
  }

  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({ id: blog.id });
  } catch (error) {
    return c.text("some error occured ");
  }
});

// return all the blogs
blog.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.post.findMany();
  return c.json({
    blogs,
  });
});

// getting the blog
blog.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    return c.json({ blog });
  } catch (error) {
    return c.text("some error occured ");
  }
});

export default blog;
