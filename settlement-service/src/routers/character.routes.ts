import express, { Response } from "express";
import SolanaAdapter from "../data/solana.adapter";

const data = SolanaAdapter.Instance();

export const characterRoutes = express.Router();

characterRoutes.get("/:id", async (req: { params: { id: string } }, res: Response) => {
    try {
        res.status(200).send(await data.getTokenAccounts(req.params.id));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});