import { z } from 'zod';

export const authValidatorSignup = z.object({
  username: z
    .string()
    .trim()
    .min(4, { message: "The username should contain at least 6 characters" })
    .max(20, { message: "Username should contain at most 20 characters" }),
    
  email: z
    .email({ message: "Invalid email address" })
    .trim(),
    
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmpassword: z
    .string()
    .min(8, { message: "Password should be at least 8 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});


export const authValidatorSignin  = z.object({
    email : z.email({message: "Invaid email address"}).trim(),
    password : z.string()
    .min(8, { message: "Password should be at least 8 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
})

export const authValidatorEmail = z.object({
    email : z.email({message: "Invaid email address"}).trim(),
})