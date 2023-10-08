import createHttpError from "http-errors";
import { Repository } from "typeorm";

import { Roles } from "@/constatns";
import { User } from "@/entity/User";
import { IUserData } from "@/types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: IUserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
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
}
