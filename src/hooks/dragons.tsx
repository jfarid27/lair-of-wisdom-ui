import { useState, useEffect, useContext } from "react";
import { AccountContext } from '../context/account';


import Whatshot from '@material-ui/icons/Whatshot';
import Fastfood from '@material-ui/icons/Fastfood';
import Hotel from '@material-ui/icons/Hotel';
import BathtubIcon from '@material-ui/icons/Bathtub';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Healing from '@material-ui/icons/Healing';
import BN from "bn.js";

const NEEDS_THRESHOLD = 5;
const BREED_COOLDOWN_INIT = 12 * 3600;
const UPGRADE_COOLDOWN = 3600;

/**
 * Enumerates the available action names for Dragons.
 */
export enum DragonActionName {
  Attack = "Attack",
  Sleep = "Sleep",
  Feed = "Feed",
  Clean = "Clean",
  Play = "Play",
  Heal = "Heal",
  ProposeBreed = "Propose Breed",
  AcceptBreed = "Accept Breed"
};

/**
 * Holds specific data and calls to execute an entities available action.
 */
interface AvailableAction {
  name: DragonActionName,
  Icon: any,
  disabled?: boolean,
  isCallData: boolean,
  callData: Array<String>,
  call: (callData: any) => Promise<void>
}

/**
 * Hold data about a specific instance of a dragon.
 */
export interface DragonData {
    address: string,
    name: string,
    health: string,
    maxHealth : string,
    healthPercent: string,
    attackCooldown: string,
    healthRegeneration: string,
    playerTrust: string,
    damage: string,
    getHunger: string,
    getSleepiness: string,
    getUncleanliness: string,
    getBoredom: string,
    realSecondsUntilBreed: string,
    realSecondsUntilAttack: string,
    realSecondsUntilUpgrade: string,
    availableActions: [AvailableAction]
}

export type DragonsGameState = Array<DragonData>;



/**
 * Updates the dragons game state and data using given contracts.
 * @param {*} contracts
 * @param {*} dispatch
 */
async function updateDragonState(accountState: any, dispatch: any) {
  const { contracts, resetContracts } = accountState;
  try {
    const dragons = await Promise.all(contracts.Dragons.map(async (dragon: any) => {
      const [
        name,
        maxHealth,
        health,
        attackCooldown,
        playerTrust,
        healthRegeneration,
        damage,
        canDragonAttack,
        canDragonBreed,
        getHunger,
        getSleepiness,
        getUncleanliness,
        getBoredom,
        breedCount,
        secondsUntilBreed,
        secondsUntilUpgrade,
        secondsUntilAttack
      ] = await Promise.all([
        dragon.methods.name().call(),
        dragon.methods.maxHealth().call(),
        dragon.methods.health().call(),
        dragon.methods.attackCooldown().call(),
        dragon.methods.trust(accountState.address).call(),
        dragon.methods.healthRegeneration().call(),
        dragon.methods.damage().call(),
        dragon.methods.canAttack().call(),
        dragon.methods.canBreed().call(),
        dragon.methods.getHunger().call(),
        dragon.methods.getSleepiness().call(),
        dragon.methods.getUncleanliness().call(),
        dragon.methods.getBoredom().call(),
        dragon.methods.breedCount().call(),
        dragon.methods.secondsUntilBreed().call(),
        dragon.methods.secondsUntilUpgrade().call(),
        dragon.methods.secondsUntilAttack().call()
      ])

      const healthPercent = new BN(health).mul(new BN('10000')).div(new BN(maxHealth)).div(new BN('100'));

      const realSecondsUntilBreed = Number(secondsUntilBreed) > 0 ? new BN(2 *  (BREED_COOLDOWN_INIT * (2 ** (Number(breedCount) + 1))) - Number(secondsUntilBreed)): new BN('0');
      const realSecondsUntilAttack = Number(secondsUntilAttack) > 0 ? new BN(attackCooldown).mul(new BN('2')).sub(new BN(secondsUntilAttack)): new BN('0');
      const realSecondsUntilUpgrade = Number(secondsUntilUpgrade) > 0 ? new BN((2 * UPGRADE_COOLDOWN) - Number(secondsUntilUpgrade)): new BN('0');

      const canAttack = canDragonAttack && (new BN(playerTrust)).gte(new BN('4'));
      const canProposeBreed = (new BN(playerTrust)).gte(new BN('10'));
      const canAcceptBreed = canDragonBreed && (new BN(playerTrust)).gte(new BN('10'));

      /**
       * List of availale actions for an instantiated Dragon.
       */
      const availableActions: Record<DragonActionName, AvailableAction> = {
        [DragonActionName.Attack]: {
          name: DragonActionName.Attack,
          Icon: Whatshot,
          disabled: !(canAttack),
          isCallData: true,
          callData: ['address'],
          call: async (callData: any) => {
            await dragon.methods.attack(callData.address).send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [DragonActionName.Feed]: {
          name: DragonActionName.Feed,
          Icon: Fastfood,
          disabled: !(getHunger > NEEDS_THRESHOLD),
          isCallData: false,
          callData: [],
          call: async (callData: any) => {
            await dragon.methods.feed().send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [DragonActionName.AcceptBreed]: {
          name: DragonActionName.AcceptBreed,
          Icon: ChildCareIcon,
          isCallData: true,
          disabled: !canAcceptBreed,
          callData: ['address', 'name'],
          call: async (callData: any) => {
            await dragon.methods.breed(callData.address, callData.name).send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [DragonActionName.Sleep]: {
          name: DragonActionName.Sleep,
          Icon: Hotel,
          isCallData: false,
          disabled: !(getSleepiness > NEEDS_THRESHOLD),
          callData: [],
          call: async (callData: any) => {
            await dragon.methods.sleep().send({
              from: accountState.address
            })
            resetContracts();
          }
      },
      [DragonActionName.Clean]: {
          name: DragonActionName.Clean,
          Icon: BathtubIcon,
          isCallData: false,
          callData: [],
          disabled: !(getUncleanliness > NEEDS_THRESHOLD),
          call: async (callData: any) => {
            await dragon.methods.clean().send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [DragonActionName.Play]: {
          name: DragonActionName.Play,
          Icon: SportsEsportsIcon,
          disabled: !(getBoredom > NEEDS_THRESHOLD),
          isCallData: false,
          callData: [],
          call: async (callData: any) => {
            await dragon.methods.play().send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [DragonActionName.Heal]: {
          name: DragonActionName.Heal,
          Icon: Healing,
          disabled: !(maxHealth - health >= healthRegeneration && playerTrust >= 1),
          isCallData: false,
          callData: [],
          call: async (callData: any) => {
            await dragon.methods.heal().send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [DragonActionName.ProposeBreed]: {
          name: DragonActionName.ProposeBreed,
          Icon: FavoriteIcon,
          isCallData: true,
          disabled: !canProposeBreed,
          callData: ['address'],
          call: async (callData: any) => {
            await dragon.methods.proposeBreed(callData.address, callData.name).send({
              from: accountState.address
            })
            resetContracts();
          }
        }
      };

      return {
        address: dragon.options.address,
        name,
        health,
        maxHealth,
        healthPercent,
        attackCooldown,
        healthRegeneration,
        playerTrust,
        damage,
        getHunger,
        getSleepiness,
        getUncleanliness,
        getBoredom,
        realSecondsUntilBreed,
        realSecondsUntilAttack,
        realSecondsUntilUpgrade,
        availableActions: availableActions
      };
    }));
    dispatch((state: any) => {
      return dragons;
    });
  } catch (err) {
    console.log(err)
    // TODO: Setup error handling.
  }
}

/**
 * Hook to expose instantiated dragon data. Only available if account state has been instantiated.
 * @see AccountContext
 * @name Dragon
 * @returns Array of instantiated Dragons.
 */
export const useDragons = () => {
  const { accountState } = useContext(AccountContext);
  const [dragons, dispatch] = useState<DragonsGameState>([]);
  useEffect(() => {
    if (!accountState.contracts) return;
    updateDragonState(accountState, dispatch);
  }, [accountState, accountState.contracts]);

  return dragons;
}
