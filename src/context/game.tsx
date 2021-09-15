import React, { createContext, useState, useEffect, useContext } from "react";
import { AccountContext } from './account';

/**
 * Updates the dragons game state and data using given contracts.
 * @param {*} contracts
 * @param {*} dispatch
 */
async function updateDragonState(contracts: any, dispatch: any) {
  try {
    const dragons = await Promise.all(contracts.Dragons.map(async (dragon: any) => {
      const name = await dragon.methods.name().call();
      return {
        address: dragon.options.address,
        name
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
async function updateGameState(contracts: any, dispatch: any) {
  updateDragonState(contracts, dispatch);
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
    updateGameState(accountState.contracts, dispatch);
  }, [accountState, accountState.contracts]);

  return <GameContext.Provider value={ gameState }>
    { children }
  </GameContext.Provider>;
}

export default Game