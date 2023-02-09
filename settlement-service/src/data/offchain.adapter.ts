import { CharactersModel } from "../models/characters.model";

export default class OffChainAdapter {


    static _instance: OffChainAdapter;

    static Instance(): OffChainAdapter {
        if (!OffChainAdapter._instance)
            OffChainAdapter._instance = new OffChainAdapter;

        return OffChainAdapter._instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    _balance = 500;

    async getBalance(id: string): Promise<number> {
        return this._balance;
    }

    async amendBalance(id: string, value: number): Promise<boolean> {
        if (this._balance + value < 0)
            return false;

        this._balance += value;
        return true;
    }

    async getUserCharacters(id: string): Promise<CharactersModel[]> {
        return [{ prefab: "Character_Cyber_Male_01" }];
    }

}