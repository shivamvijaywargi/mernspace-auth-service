import { Request, Response } from "express";

export class AuthController {
  register(req: Request, res: Response) {
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
