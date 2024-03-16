import express from "express";
import CircleController from "./CircleController";

const circleRouter = express.Router();

circleRouter
  .post("/generate-entity-cipher", CircleController.generateEntitySecretCipherText)
  .post("/create-dev-wallet", CircleController.createDevWallet);

export default circleRouter;