import { Request, Response, Router } from "express";
import { TaxationController } from "../controllers/taxation.controller";
import OffChainAdapter from "../data/offchain.adapter";
import { QuestController } from "../controllers/quest.controller";
import BuildingsController from "../controllers/buildings.controller";

export const turnRoutes = Router();

const data = OffChainAdapter.Instance();

turnRoutes.post("/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        const buildings = await BuildingsController.getUserBuildings(id);

        await data.amendBalance(id, await TaxationController.collect(buildings));

        for (const building of buildings)
            if (building.state)
                building.state--;

        await BuildingsController.save();

        QuestController.onTurn(id);

        res.status(200).send(true);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
