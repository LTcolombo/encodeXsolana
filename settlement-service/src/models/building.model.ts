
export enum BuildingType {
    Generator,
    Distributor,
    Shop,
    Factory,
    Hotel
}

export default class BuildingModel {
    public type: BuildingType;
    public x: number;
    public y: number;

    public level: number;
    public state: number;
}
