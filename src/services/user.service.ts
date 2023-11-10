import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { Repository } from "typeorm";

import { Roles } from "../constants";
import { User } from "../entity/User";
import { IUserRegisterData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: IUserRegisterData) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const err = createHttpError(400, "Email already exists");

      throw err;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to create user in the database",
      );

      throw error;
    }
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
}
