import { Router } from "express";

import { AuthController } from "@/controllers/auth.controller";

const authRouter = Router();

const authController = new AuthController();

// authController bind Read more: https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
authRouter.post("/register", (req, res) => authController.register(req, res));

export default authRouter;
