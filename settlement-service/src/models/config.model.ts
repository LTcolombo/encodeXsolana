import { BuildingType } from "./building.model";
import fs from 'fs';

export class BuildingConfigModel {
    public type: BuildingType;
    public width: number;
    public height: number;
    public prefab: string;
}

export class QuestOutcome {
    type: string;
    id: number;
    building: BuildingType;
    state: number;
    cost: number;
}

export default class ConfigModel {

    static async setQuestConfig(id: string, value: QuestOutcome[]) {

        if (!ConfigModel.questConfig) {
            ConfigModel.questConfig = await ConfigModel._load<{string:QuestOutcome[]}>('quests');
        }
        
        ConfigModel.questConfig[id] = value;
        await ConfigModel._save<{ string: QuestOutcome[] }>('quests', ConfigModel.questConfig);
        return true;
    }

    static async getQuests(): Promise<{string:QuestOutcome[]}> {
        if (!ConfigModel.questConfig) {
            ConfigModel.questConfig = await ConfigModel._load<{string:QuestOutcome[]}>('quests');
        }

        return ConfigModel.questConfig;
    }

    private static async _load<T>(id: string): Promise<T> {
        const path = `./data/${id}`;
        return fs.existsSync(path) ? JSON.parse(await fs.promises.readFile(path, "utf-8")) : null;
    }

    private static async _save<T>(id: string, value: T): Promise<void> {
        if (!fs.existsSync("./data"))
            fs.mkdirSync("./data");

        const path = `./data/${id}`;
        await fs.promises.writeFile(path, JSON.stringify(value, null, 2));
    }

    private static questConfig;

    static buildConfig: {
        width: number,
        height: number,
        buildings: Array<BuildingConfigModel>
    } = {
            width: 26,
            height: 23,

            buildings: [
                {
                    type: BuildingType.Generator,
                    width: 4,
                    height: 4,
                    prefab: "Buildings/Generator"
                },

                {
                    type: BuildingType.Distributor,
                    width: 2,
                    height: 2,
                    prefab: "Buildings/Distributor"
                },

                {
                    type: BuildingType.Shop,
                    width: 4,
                    height: 4,
                    prefab: "Buildings/Shop"
                },

                {
                    type: BuildingType.Factory,
                    width: 4,
                    height: 4,
                    prefab: "Buildings/Factory"
                },

                {
                    type: BuildingType.Hotel,
                    width: 4,
                    height: 4,
                    prefab: "Buildings/Hotel"
                }
            ]
        }

    public static getBuildingConfig(type: BuildingType): BuildingConfigModel {
        return this.buildConfig.buildings.find(b => b.type == type);
    }
}