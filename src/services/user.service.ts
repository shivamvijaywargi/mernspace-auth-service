import { Repository } from "typeorm";

import { User } from "@/entity/User";
import { IUserData } from "@/types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: IUserData) {
    await this.userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });
  }
}
