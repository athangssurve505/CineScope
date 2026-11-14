import { Router } from "express";
import { register , login , rotateToken , getCurrentUser, logout } from "../controllers/auth.controller.js";

const authRouter = Router();

import validate from "../middlewares/validate.middleware.js";
import { registerSchema , loginSchema } from "../validation/auth.validation.js";
import verifyAccessToken from "../middlewares/auth.middleware.js";
import { createRateLimiter } from "../middlewares/rateLimiter.middleware.js";


// Registration: 10 requests per hour
const registerLimiter = createRateLimiter(
    10,
    60 * 60 * 1000,
    "Too many registration attempts. Try again later."
);

// Login: 5 requests per 15 minutes
const loginLimiter = createRateLimiter(
    5,
    15 * 60 * 1000,
    "Too many login attempts. Try again later."
);

// Refresh: 30 requests per 15 minutes
const refreshLimiter = createRateLimiter(
    30,
    15 * 60 * 1000,
    "Too many refresh requests. Try again later."
);

authRouter.post("/register",registerLimiter,validate(registerSchema),register);
authRouter.post("/login",loginLimiter,validate(loginSchema),login);
authRouter.get("/refresh",refreshLimiter,rotateToken)
authRouter.get("/me",verifyAccessToken,getCurrentUser)
authRouter.post("/logout", logout);

export default authRouter