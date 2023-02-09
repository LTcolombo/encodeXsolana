using System;
using System.Threading.Tasks;
using Avatar;
using CityBuilding;
using Utils.Injection;

namespace DefaultNamespace
{
    [Flags]
    public enum DirtyData
    {
        Balance = 1,
        Characters = 1 << 1,
        Buildings = 1 << 2,
        Quests = 1 << 3
    }

    [Singleton]
    public class DataController : InjectableObject<DataController>
    {
        [Inject] private AccountModel _account;
        [Inject] private BalanceModel _balance;
        [Inject] private BuilderModel _buildings;
        [Inject] private CharacterModel _characters;
        [Inject] private QuestModel _quests;


        public async Task Refresh(
            DirtyData flags = DirtyData.Balance | DirtyData.Buildings | DirtyData.Characters | DirtyData.Quests)
        {
            if ((flags & DirtyData.Balance) > 0)
                await _balance.Update(_account.Id);

            if ((flags & DirtyData.Buildings) > 0)
                await _buildings.Load(_account.Id);

            if ((flags & DirtyData.Characters) > 0){
                await _characters.Load(_account.Id);
            }

            if ((flags & DirtyData.Quests) > 0)
                await _quests.Load(_account.Id);
        }
    }
}