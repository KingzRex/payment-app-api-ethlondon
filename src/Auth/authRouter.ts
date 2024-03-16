import express from "express";
import AuthController from "./AuthController";

const authRouter = express.Router();

authRouter.post("/signin", AuthController.signIn);

export default authRouter;