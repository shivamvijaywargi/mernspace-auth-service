import { Response } from "express";

import { UserService } from "@/services/user.service";
import { IRegisterUserRequest } from "@/types";

export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: IRegisterUserRequest, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    await this.userService.create({ firstName, lastName, email, password });

    res.status(201).json();
  }
}

// Functional way
// const register: RequestHandler = async (req, res) => {
//   res.status(201).send("Registered");
// };

// export default {
//   register,
// };
