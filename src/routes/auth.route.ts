import { Router } from "express";

import { AppDataSource } from "@/config/data-source";
import { AuthController } from "@/controllers/auth.controller";
import { User } from "@/entity/User";
import { UserService } from "@/services/user.service";

const authRouter = Router();

const userReposiroty = AppDataSource.getRepository(User);
const userService = new UserService(userReposiroty);
const authController = new AuthController(userService);

// authController bind Read more: https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post("/register", (req, res) => authController.register(req, res));

export default authRouter;
