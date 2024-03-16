import { Request } from "express";
import { UNAUTHORIZED } from "../Constants/StatusCodes";
import { HttpException } from "../exceptions/HttpExceptions";

const requestUser = (req: Request) => {
  const user = req.user;

  if (!user) throw new HttpException(UNAUTHORIZED, "User is not authorized");

  return user;
};

export { requestUser };