import ConfigModel, { BuildingConfigModel } from "../models/config.model";
import BuildingModel, { BuildingType } from "../models/building.model";
import fs from 'fs';

export default class BuildingsController {
    static data;


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

    static async getUserBuildings(id: string): Promise<Array<BuildingModel>> {

        if (!BuildingsController.data){
            BuildingsController.data = BuildingsController._load('buildings');
        }

        if (!BuildingsController.data){
            BuildingsController.data = {};
        }

        if (!BuildingsController.data[id]) {
            BuildingsController.data[id] = [{
                type: BuildingType.Hotel,
                x: 17,
                y: 3,
                level: 2,
                state: 3
            },
            {
                type: BuildingType.Factory,
                x: 17,
                y: 14,
                level: 3,
                state: 3
            }];

            BuildingsController._save('buildings', BuildingsController.data);
        }


        return BuildingsController.data[id];
    }

    static async save() {
        BuildingsController._save('buildings', BuildingsController.data);
    }


    static async add(id: string, value: BuildingModel): Promise<boolean> {
        const userData = await BuildingsController.data[id];
        userData.push(value);

        BuildingsController._save('buildings', BuildingsController.data);

        return true;
    }

    public static getCellsData(data: Array<BuildingModel>) {

        const result = [];

        for (let i = 0; i < ConfigModel.buildConfig.width; i++) {
            result.push([]);
            for (let j = 0; j < ConfigModel.buildConfig.height; j++)
                result[i].push(0);
        }

        for (const building of data) {
            const config = ConfigModel.getBuildingConfig(building.type);

            for (let i = building.x - config.width / 2; i < building.x + config.width / 2; i++)
                for (let j = building.y - config.height / 2; j < building.y + config.height / 2; j++)
                    result[i | 0][j | 0] = 1;
        }

        return result;
    }

    public static checkIfFits(data: Array<BuildingModel>, building: BuildingModel, config: BuildingConfigModel): boolean {
        const cells = BuildingsController.getCellsData(data);
        for (let i = building.x - config.width / 2; i < building.x + config.width / 2; i++)
            for (let j = building.y - config.height / 2; j < building.y + config.height / 2; j++)
                if (cells[i | 0][j | 0] != 0)
                    return false;

        return true;
    }

}