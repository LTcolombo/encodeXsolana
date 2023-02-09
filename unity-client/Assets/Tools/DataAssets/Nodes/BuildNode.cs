using Avatar;
using CityBuilding;
using DefaultNamespace;
using xNode_1._8._0.Scripts;

namespace Nodes
{
    [NodeTint("#994422")]
    public class BuildNode : Node, IDialogueNode, IExportable
    {
        public int id;
        [Input(ShowBackingValue.Never)] 
        public string @in;

        public BuildingType building;
        public int cost;

        public async void Trigger()
        {
            if (await QuestService.Instance.CompleteQuest(AccountModel.Instance.Id, graph.name, id)){
                BuilderModel.Instance.StartPlacement(building);
                _ = DataController.Instance.Refresh();
            }
        }
        

        public object Export() 
        {
            return new { type = "Build", id, building, cost };
        }
    }
}