import { Request, Response, Router } from "express";
import SolanaAdapter from "../data/solana.adapter";

export const testRoutes = Router();

const data = SolanaAdapter.Instance();

testRoutes.post("/transfer", async (req: Request, res: Response) => {
    try {
        res.status(200).send(await data.transferCredits(req.body.to, req.body.amount));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});



testRoutes.post("/mintNft", async (req: Request, res: Response) => {
    try {
        res.status(200).send(await data.mintAgentNFT(req.body.to, req.body.id));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

testRoutes.get("/:id", async (req: Request, res: Response) => {
    try {
        res.status(200).send(await data.getTokenAccounts(req.params.id));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
