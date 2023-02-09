import express, { Request, Response } from "express";
import ConfigModel from "../models/config.model";

export const configRoutes = express.Router();

configRoutes.get("/", async (req: Request, res: Response) => {
    try {
        res.status(200).send(ConfigModel.buildConfig);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

configRoutes.post("/quest", async (req: Request, res: Response) => {
    try {

        for (const key in req.body)
            ConfigModel.setQuestConfig(key, req.body[key]);

        res.status(200).send({});
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});