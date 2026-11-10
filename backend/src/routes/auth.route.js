import { Router } from "express";
import { register , login , rotateToken } from "../controllers/auth.controller.js";

const authRouter = Router();

import validate from "../middlewares/validate.middleware.js";
import { registerSchema , loginSchema } from "../validation/auth.validation.js";

authRouter.post("/register",validate(registerSchema),register);
authRouter.post("/login",validate(loginSchema),login);
authRouter.get("/refresh",rotateToken)

export default authRouter