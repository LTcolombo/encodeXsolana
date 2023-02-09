using Avatar;
using CityBuilding;
using DefaultNamespace;
using xNode_1._8._0.Scripts;

namespace Nodes
{
    [NodeTint("#994422")]
    public class MintAgentNode : Node, IDialogueNode, IExportable
    {
        [Input(ShowBackingValue.Never)] public string @in;

        public int id;

        public async void Trigger()
        {
            if (await QuestService.Instance.CompleteQuest(AccountModel.Instance.Id, graph.name, id))
                _ = DataController.Instance.Refresh();
        }
        
        public object Export() 
        {
            return new { type = "MintAgent", id };
        }
    }
}