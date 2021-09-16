import React, { createContext } from "react";
import { DragonsGameState, useDragons } from '../hooks/dragons';

/**
 * Interface for the game state.
 */
interface GameState {
  dragons?: DragonsGameState,
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
