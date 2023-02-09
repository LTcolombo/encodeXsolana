using Avatar;
using CityBuilding;
using DefaultNamespace;
using xNode_1._8._0.Scripts;

namespace Nodes
{
    [NodeTint("#994422")]
    public class DepositNode : Node, IDialogueNode
    {
        [Input(ShowBackingValue.Never)] public string @in;

        public int amount;

        public async void Trigger()
        {
            
        }
    }
}