using System;
using Avatar;
using CityBuilding;
using DefaultNamespace.Model;
using Tools.DataAssets.Nodes;
using UnityEngine;
using UnityEngine.AI;
using Utils.Injection;

[RequireComponent(typeof(Collider))]
public class DialogueTrigger : InjectableBehaviour
{
    [Inject] private InteractionModel _interaction;
    [Inject] private QuestModel _quests;

    [SerializeField] private GameObject indicator;

    private DialogueUI _ui;
    private static readonly int Talk = Animator.StringToHash("Talk");
    private DialogueGraph _graph;
    [HideInInspector] public string initiator;
    private QuestInstance _quest;

    private void Start()
    {
        var parent = transform.parent;
        initiator = parent.name;

        UpdateCurrentQuest();
        _quests.Updated.Add(UpdateCurrentQuest);
    }

    public void UpdateCurrentQuest()
    {
        var parent = transform.parent;

        var quest = _quests.FindQuest(initiator);
        var handleSelection = parent.GetComponent<HandleSelection>();
        var outline = parent.GetComponent<Outline>();
        _quest = quest;

        if (handleSelection != null)
            handleSelection.enabled = quest != null;
        if (outline != null)
            outline.enabled = quest != null;
        if (indicator != null)
            indicator.SetActive(quest != null);
    }

    private void OnTriggerEnter(Collider other)
    {
        var nav = other.GetComponent<NavMeshAgent>();
        if (nav != null)
            nav.ResetPath();

        other.transform.LookAt(transform.parent);

        if (transform.parent.GetComponent<Animator>() != null)
            transform.parent.LookAt(other.transform);

        _ui = FindObjectOfType<DialogueUI>();

        _ui.answerSelected.RemoveAllListeners();
        _ui.answerSelected.AddListener(OnAnswerSelected);
        _graph = Resources.Load<DialogueGraph>(_quest.id);

        if (_graph == null)
            return;

        _graph.Start();
        _ui.Setup(transform.parent);
        _ui.ShowChat(_graph.current);
        StartDialogue();
    }

    private void StartDialogue()
    {
        if (transform.parent.GetComponent<Animator>() != null)
            transform.parent.GetComponent<Animator>().SetTrigger(Talk);

        _ui.transform.GetChild(0).gameObject.SetActive(true);

        Camera.main.GetComponent<LookAtDialogue>().right = gameObject;

        _interaction.Set(InteractionState.Dialog);
    }

    private void OnAnswerSelected(int index)
    {
        _graph.SubmitAnswer(index);

        if (_graph.current == null)
            ExitDialogue();
        else
        {
            _ui.ShowChat(_graph.current);

            if (transform.parent.GetComponent<Animator>() != null)
                transform.parent.GetComponent<Animator>().SetTrigger(Talk);
        }
    }

    private void ExitDialogue()
    {
        if (_ui != null)
        {
            _ui.answerSelected.RemoveAllListeners();
            _ui.transform.GetChild(0).gameObject.SetActive(false);
        }

        if (_interaction.Get() == InteractionState.Dialog)
            _interaction.Set(InteractionState.Walking);
    }

    private void OnDestroy()
    {
        _quests.Updated.Remove(UpdateCurrentQuest);
    }
}