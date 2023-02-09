using System.Linq;
using CityBuilding;
using UnityEngine;
using Utils.Injection;

public class DisplayCharacters : InjectableBehaviour
{
    [Inject] private CharacterModel _model;
    [Inject] private BuilderModel _buildings;

    private void Start()
    {
        RenderChars();
    }

    private void RenderChars()
    {
        var placeholderCount = transform.childCount;
        for (var i = 0; i < placeholderCount; i++)
        {
            var placeholder = transform.GetChild(0);

            var character = i < _model.Characters.Length ? _model.Characters[i] : null;

            if (!string.IsNullOrEmpty(character))
            {
                var characterObj = Instantiate(Resources.Load<GameObject>("Characters/" + character), transform);
                characterObj.transform.position = placeholder.position;
                characterObj.transform.rotation = placeholder.rotation;
                characterObj.gameObject.name = character;

                var dialogue = characterObj.GetComponentInChildren<DialogueTrigger>();
                dialogue.initiator = character;
                dialogue.UpdateCurrentQuest();
            }

            DestroyImmediate(placeholder.gameObject);
        }
    }
}