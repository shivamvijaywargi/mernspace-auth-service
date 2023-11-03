import bcrypt from "bcryptjs";

export class CredentialService {
  async comparePassword(
    userPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashedPassword);
  }
}
