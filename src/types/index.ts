import { Request } from "express";

export interface IUserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUserUpdateData extends Partial<IUserRegisterData> {}

export interface IUserLoginData {
  email: string;
  password: string;
}

export interface IRegisterUserRequest extends Request {
  body: IUserRegisterData;
}

export interface ILoginUserRequest extends Request {
  body: IUserLoginData;
}

export interface IUpdateUserRequest extends Request {
  body: IUserUpdateData;
}

export interface IAuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface IRefreshTokenPayload {
  id: string;
}

export interface ITenant {
  name: string;
  address: string;
}

export interface ICreateTenantRequest extends Request {
  body: ITenant;
}
