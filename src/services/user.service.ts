import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { Repository } from "typeorm";

import { logger } from "../config/logger";
import { User } from "../entity/User";
import { IUserRegisterData, IUserUpdateData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({
    firstName,
    lastName,
    email,
    password,
    tenantId,
    role,
  }: IUserRegisterData) {
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
        role,
        tenantId: tenantId ? { id: tenantId } : undefined,
      });
    } catch (err) {
      logger.error(err);

      const error = createHttpError(
        500,
        "Failed to create user in the database",
      );

      throw error;
    }
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ["id", "firstName", "lastName", "email", "role", "password"],
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        tenant: true,
      },
    });
  }

  async update(
    userId: number,
    { firstName, lastName, role }: Partial<IUserUpdateData>,
  ) {
    try {
      return await this.userRepository.update(userId, {
        firstName,
        lastName,
        role,
      });
    } catch (err) {
      logger.error(err);

      const error = createHttpError(
        500,
        "Failed to update the user in the database",
      );
      throw error;
    }
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async deleteById(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
