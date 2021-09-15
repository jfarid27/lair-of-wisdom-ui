import React, { createContext, useState, useEffect, useContext } from "react";
import { AccountContext } from './account';
import BN from 'bn.js';

/**
 * Updates the dragons game state and data using given contracts.
 * @param {*} contracts
 * @param {*} dispatch
 */
async function updateDragonState(accountState: any, dispatch: any) {
  const { contracts, web3 } = accountState;
  try {
    const dragons = await Promise.all(contracts.Dragons.map(async (dragon: any) => {
      const name = await dragon.methods.name().call();
      const maxHealth = await dragon.methods.maxHealth().call();
      const health = await dragon.methods.health().call();
      const attackCooldown = await dragon.methods.attackCooldown().call();
      const playerTrust = await dragon.methods.trust(accountState.address).call();
      const canAttack = await dragon.methods.canAttack().call();
      const canBreed = await dragon.methods.canBreed().call();

      return {
        address: dragon.options.address,
        name,
        health,
        maxHealth,
        attackCooldown,
        playerTrust,
        canAttack,
        canBreed
      };
    }));
    dispatch((state: any) => {
      state.dragons = dragons;
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
  dragons: [any?]
}

const defaultGameState: GameState = {
  dragons: []
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