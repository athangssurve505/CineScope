import { Router } from "express";
import { register , login , rotateToken , getCurrentUser, logout } from "../controllers/auth.controller.js";

const authRouter = Router();

import validate from "../middlewares/validate.middleware.js";
import { registerSchema , loginSchema } from "../validation/auth.validation.js";
import verifyAccessToken from "../middlewares/auth.middleware.js";

authRouter.post("/register",validate(registerSchema),register);
authRouter.post("/login",validate(loginSchema),login);
authRouter.get("/refresh",rotateToken)
authRouter.get("/me",verifyAccessToken,getCurrentUser)
authRouter.post("/logout", logout);

export default authRouter