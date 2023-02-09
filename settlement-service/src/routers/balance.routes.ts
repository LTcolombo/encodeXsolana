import express, { Response } from "express";
import OffChainAdapter from "../data/offchain.adapter";

const blockchain = OffChainAdapter.Instance();

export const balanceRoutes = express.Router();

balanceRoutes.get("/:id", async (req: {params:{id:string}}, res: Response) => {
    try {
        res.json(await blockchain.getBalance(req.params.id)).status(200);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

