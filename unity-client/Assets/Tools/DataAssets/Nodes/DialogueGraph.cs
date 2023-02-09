using System.Collections.Generic;
using Avatar;
using Newtonsoft.Json;
using Nodes;
using UnityEngine;
using xNode_1._8._0.Scripts;

namespace Tools.DataAssets.Nodes
{
    [CreateAssetMenu(menuName = "Game/DialogueGraph", order = 0)]
    public class DialogueGraph : NodeGraph
    {
        [HideInInspector] public ChatNode current;

        public ChatNode SubmitAnswer(int i)
        {
            Debug.Log(i);

            current.SubmitAnswer(i);
            return current;
        }

        public void Start()
        {
            var startingNode = nodes.Find(x => x is StartNode) as StartNode;
            if (startingNode == null) return;

            var port = startingNode.GetPort("out");
            if (port == null) return;

            current = null;

            for (var i = 0; i < port.ConnectionCount; i++)
            {
                var connection = port.GetConnection(i);
                if (connection.node is ChatNode chat)
                {
                    current = chat;
                    Debug.Log(current);
                }
            }
        }

        public override void Save()
        {
            var actionableNodes = new List<object>();
            foreach (var node in nodes)
            {
                if (node is IExportable exportable)
                    actionableNodes.Add(exportable.Export());
            }

            _ = new HttpService().Post("http://localhost:8102/api/config/quest",
                JsonConvert.SerializeObject(new Dictionary<string, object>
                {
                    [name] = actionableNodes
                }));
        }
    }
}