import { Request, Response, Router } from "express";
import { QuestController } from "../controllers/quest.controller";

export const questsRoutes = Router();

questsRoutes.get("/:id", async (req: Request, res: Response) => {
    try {
        res.status(200).send(await QuestController.get(req.params.id));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

questsRoutes.post("/:id", async (req: Request, res: Response) => {
    try {

        if (req.body.questId == undefined || !req.body.outcomeId == undefined) {
            res.status(400).send(`invalid request body ${JSON.stringify(req.body)}`);
            return;
        }

        res.status(200).send(await QuestController.complete(req.params.id, req.body.questId, req.body.outcomeId));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
