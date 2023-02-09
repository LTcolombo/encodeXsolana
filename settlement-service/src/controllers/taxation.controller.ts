import BuildingModel from "../models/building.model";

export class TaxationController {
    static async collect(buildings: BuildingModel[]): Promise<number> {

        let result = 0;

        for (const building of buildings) {
            if (building.level && building.state)
                result += building.level * building.state;
        }

        return result;
    }
}
