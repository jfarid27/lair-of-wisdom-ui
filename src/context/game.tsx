import React, { createContext } from "react";
import { DragonGameState, useDragons } from './dragons';

/**
 * Interface for the game state.
 */
interface GameState {
  dragons?: DragonGameState,
}

/**
 * React Context Object for game data.
 */
export const GameContext = createContext<GameState>({});

/**
 * Component mixer for the Game Context.
 * @param {*} param0 
 * @returns ReactComponent
 * @see DragonsContext
 */
 const Game:React.FC<{}> = ({ children }: any) => {
  const dragons = useDragons();
  return <GameContext.Provider value={ { dragons } }>
    { children }
  </GameContext.Provider>;
}

export default Game
