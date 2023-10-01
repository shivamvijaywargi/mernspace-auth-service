import { Request } from "express";

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRegisterUserRequest extends Request {
  body: IUserData;
}
