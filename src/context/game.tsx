import React, { createContext, useState, useEffect, useContext } from "react";
import { AccountContext } from './account';


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

type ActionName = "attack" | "sleep" | "feed" | "clean" | "play" | "heal" | "proposeBreed" | "acceptBreed";

interface AvailableAction {
  name: string,
  Icon: any,
  disabled?: boolean,
  isCallData: boolean,
  callData: Array<String>,
  call: (callData: any) => Promise<void>
}

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

      const availableActions: Record<ActionName, AvailableAction> = {
        attack: {
          name: 'Attack',
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
        feed: {
          name: 'Feed',
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
        acceptBreed: {
          name: 'Accept Breed',
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
        sleep: {
          name: 'Sleep',
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
      clean: {
          name: 'Clean',
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
        play: {
          name: 'Play',
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
        heal: {
          name: 'Heal',
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
        proposeBreed: {
          name: 'Propose Breed',
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
      state.dragons = dragons;
      state.loaded = true;
      return { ...state };
    });
  } catch (err) {
    console.log(err)
    // TODO: Setup error handling.
  }
}

/**
 * Updates the full game state and data using given contracts.
 * @param {*} contracts 
 * @param {*} dispatch 
 */
async function updateGameState(accountState: any, dispatch: any) {
  updateDragonState(accountState, dispatch);
}

/**
 * Interface for the game state.
 */
interface GameState {
  dragons: [any?],
  loaded: boolean
}

const defaultGameState: GameState = {
  dragons: [],
  loaded: false
};

/**
 * React Context Object for game data.
 */
export const GameContext = createContext<GameState>(defaultGameState);

/**
 * Component mixer for the Game Context.
 * @param {*} param0 
 * @returns ReactComponent
 */
 const Game:React.FC<{}> = ({ children }: any) => {
  const { accountState } : any = useContext(AccountContext);
  const [gameState, dispatch] = useState<GameState>(defaultGameState);

  useEffect(() => {
    if (!accountState.contracts) return;
    updateGameState(accountState, dispatch);
  }, [accountState, accountState.contracts]);

  return <GameContext.Provider value={ gameState }>
    { children }
  </GameContext.Provider>;
}

export default Game
