import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Name must contain at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z.string({
        error:"Email is required"
    })
        .trim()
        .email("Invalid format for email address"),

    password: z.string()
        .min(8, "Password must contain at least 8 characters")
        .max(72, "Password is too long")
});


export const loginSchema = z.object({
    email: z.string({
        error:"Email is required"
    })
        .trim()
        .email("Invalid format for email address"),

    password: z.string({
        error:"Password is required"
    })
       
});