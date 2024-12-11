import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  SignUpInput,
  SignInInput,
  signInInput,
  signUpInput,
} from "@harish_52/freedump-common";

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
  const { success } = signUpInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "wrong inputs",
    });
  }

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
  const { success } = signInInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "wrong inputs",
    });
  }

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
