import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { SignUpInput, SignInInput } from "../../../common/src/zod";

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

user.use("/api/v1/blog/*", async (c, next) => {
  // get the header
  const authHeader = c.req.header("Authorization");
  // verify the header
  //@ts-ignore
  const jwt = await verify(authHeader, c.env.JWT_SECRET);
  // if the header matches we can proceed
  if (jwt.id) {
    await next();
  } else {
    // else return a 403
    c.status(403);
    return c.json({ message: "Something went wrong" });
  }
});

user.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error) {
    c.status(403);
    return c.json({ e: error });
  }
});

user.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });
  if (!user) {
    c.status(403);
    return c.json({ message: "user not found" });
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

export default user;
