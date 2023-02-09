import OffChainAdapter from "../data/offchain.adapter";
import SolanaAdapter from "../data/solana.adapter";
import ConfigModel from "../models/config.model";
import QuestAllocationModel from "../models/questallocation.model";
import BuildingsController from "./buildings.controller";


const data = OffChainAdapter.Instance();
const newQuestChance = 0.3;

const _questAllocation = new Map<string, QuestAllocationModel[]>();

export class QuestController {

    static async onTurn(id: string) {
        if (Math.random() > newQuestChance)
            return;

        if (!_questAllocation.has(id)) {
            _questAllocation.set(id, [{ id: "Fixer", initiator: "Character_Junky_Female_01" }])
            return;
        }

        if ((await _questAllocation.get(id)).length > 0)
            return;

        _questAllocation.get(id).push({ id: "Fixer", initiator: "Character_Junky_Female_01" });
    }

    static async get(id: string): Promise<QuestAllocationModel[]> {

//quick debug
        return [
            { id: "Fixer", initiator: "Character_Junky_Female_01" },
            { id: "Builder", initiator: "Character_Medical_Male_01" },
            { id: "Manager", initiator: "Character_Rich_Male_01" }   
        ]

        console.log(_questAllocation.get(id));

        //Manager quest always available
        return _questAllocation.get(id).concat({ id: "Manager", initiator: "Character_Rich_Male_01" }   );
    }

    static async complete(id: string, questId: string, outcomeId: number): Promise<boolean> {


        const outcome = await QuestController.consume(id, questId, outcomeId);
        if (!outcome)
            return false;

        //perform outcome
        if (outcome.cost && !await data.amendBalance(id, -outcome.cost))
            return false;

        if (outcome.type == "Fix") {
            const buildings = BuildingsController.getUserBuildings(id);
            (await buildings).find(b => b.type == outcome.building).state = outcome.state;
        }

        if (outcome.type == "Withdraw") {
            const solana = SolanaAdapter.Instance();
            solana.transferCredits(id, outcome.amount);
        }

        if (outcome.type == "MintAgent") {
            const solana = SolanaAdapter.Instance();
            solana.mintAgentNFT(id);
        }

        return true;
    }

    static async consume(id: string, questId: string, outcomeId: number) {
        console.log("QuestController::consume", id, questId, outcomeId);
        const userQuests = await QuestController.get(id);

        const quest = userQuests?.find(q => q.id == questId);

        if (!quest) {
            console.warn("quest not found!")
            return null;
        }


        const questConfig = (await ConfigModel.getQuests())[questId];
        if (!questConfig) {
            console.warn("quest config not found!")
            return null;
        }

        const outcome = questConfig.find(o => o.id == outcomeId);


        if (outcome) {
            await QuestController.remove(id, questId);
        } else {
            console.warn("quest outcome not found!")
            return null;
        }

        return outcome;
    }

    static async remove(id: string, questId: string) {
        const alloc = await QuestController.get(id);
        const idx = alloc.findIndex(q => q.id == questId);
        alloc.splice(idx, 1);
    }
}
