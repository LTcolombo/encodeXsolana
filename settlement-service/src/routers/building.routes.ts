import { Response, Router } from "express";
import BuildingsController from "../controllers/buildings.controller";
import BuildingModel from "../models/building.model";
import ConfigModel from "../models/config.model";

export const buildingRoutes = Router();


buildingRoutes.get("/:id", async (req: { params: { id: string } }, res: Response) => {
    try {
        const buildings = await BuildingsController.getUserBuildings(req.params.id);

        res.status(200).send(buildings);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});


buildingRoutes.post("/:id", async (req: { params: { id: string }, body: BuildingModel }, res: Response) => {
    try {
        const buildings = await BuildingsController.getUserBuildings(req.params.id);

        if (!BuildingsController.checkIfFits(buildings, req.body, ConfigModel.getBuildingConfig(req.body.type))) {
            res.status(500).send(false);
            return;
        }

        const buildingData = req.body;

        //lootbox this
        buildingData.level = 2;
        buildingData.state = 3;

        res.status(200).send(await BuildingsController.add(req.params.id, buildingData));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});