import z from "zod";

export const signUpInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const signInInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export const createBlogInput = z.object({
  title:z.string(),
  conten:z.string(),
})

export const updateBlogInput = z.object({
  title:z.string(),
  conten:z.string(),
  id:z.string()
})

export type SignUpInput = z.infer<typeof signUpInput>;
export type SignInInput = z.infer<typeof signInInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>