import z from "zod";
export declare const signUpInput: z.ZodObject<
  {
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    username: string;
    password: string;
    name?: string | undefined;
  },
  {
    username: string;
    password: string;
    name?: string | undefined;
  }
>;
export declare const signInInput: z.ZodObject<
  {
    username: z.ZodString;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    username: string;
    password: string;
  },
  {
    username: string;
    password: string;
  }
>;
export declare const createBlogInput: z.ZodObject<
  {
    title: z.ZodString;
    conten: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    title: string;
    conten: string;
  },
  {
    title: string;
    conten: string;
  }
>;
export declare const updateBlogInput: z.ZodObject<
  {
    title: z.ZodString;
    conten: z.ZodString;
    id: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    title: string;
    conten: string;
    id: string;
  },
  {
    title: string;
    conten: string;
    id: string;
  }
>;
export type SignUpInput = z.infer<typeof signUpInput>;
export type SignInInput = z.infer<typeof signInInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
