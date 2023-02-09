
import * as dotenv from "dotenv";
import express from "express";
dotenv.config();

import Bugsnag from '@bugsnag/js'
import cors from "cors";
import { configRoutes } from "./routers/config.routes";
import { balanceRoutes as balanceRoutes } from "./routers/balance.routes";
import { questsRoutes } from "./routers/quests.routes";
import { turnRoutes } from "./routers/turn.routes";
import { buildingRoutes } from "./routers/building.routes";
import { cellsRoutes } from "./routers/cells.routes";
import { testRoutes } from "./routers/test.routes";
import { characterRoutes } from "./routers/character.routes";
Bugsnag.start("9e4fbc24e93f3b61af7ba23bd26be0f0");


if (!process.env.PORT) {
    process.exit(1);
}

const app = express();

app.use(
    cors({
        origin: (origin, callback) => callback(null, true),
        credentials: true,
    })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // support encoded bodies

app.use("/api/building", buildingRoutes);
app.use("/api/config", configRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/quests", questsRoutes);
app.use("/api/cells", cellsRoutes);
app.use("/api/turn", turnRoutes);
app.use("/api/test", testRoutes);
app.use("/api/characters", characterRoutes);

app.get('/healthcheck', (req, res) => {
    res.status(200).json({});
});

app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
});