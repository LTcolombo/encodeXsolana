import { Response, Router } from "express";
import BuildingsController from "../controllers/buildings.controller";

export const cellsRoutes = Router();

cellsRoutes.get("/:id", async (req: { params: { id: string } }, res: Response) => {
    try {
        res.status(200).send(BuildingsController.getCellsData(await BuildingsController.getUserBuildings(req.params.id)));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

