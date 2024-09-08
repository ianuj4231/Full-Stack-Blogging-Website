import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6) 
  });

export const signinSchema=z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const createBlogInput = z.object({
    title: z.string(),
    content: z.string() 
})


export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string() ,
       id: z.number() 
})

export type updateBlogInput= z.infer<typeof updateBlogInput>;
export type signupSchema = z.infer<typeof signupSchema>;
export type createBlogInput= z.infer<typeof createBlogInput>;
export type signinSchema = z.infer<typeof signinSchema>;