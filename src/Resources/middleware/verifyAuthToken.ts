import { NextFunction, Request, Response } from "express";
import { UNAUTHORIZED } from "../Constants/StatusCodes";
import AuthService from "../../Auth/AuthService";
import UserService from "../../User/UserService";
import { UserRecord } from "../../Db/xata";
import { handleRequestError } from "../requestHelpers/handleRequestError";

const ONE = 1;

const VerifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(UNAUTHORIZED).json({ message: "Authorization header and Authorization value are Required" });

  try {
    const token = authHeader.split(" ")[ONE];

    const tokenPayload = AuthService.verifyDynamicAuthToken(token);

    const user = await UserService.getUserByEmail(tokenPayload.email);

    req.user = user as UserRecord;

    next();
  } catch (error) {
    handleRequestError(error, res);
  }
};

export { VerifyAccessToken };
