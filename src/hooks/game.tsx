import {  useDragons, DragonsGameState } from './dragons';

/**
 * Interface for the game state.
 */
interface GameState {
  dragons?: DragonsGameState,
}

/**
 * Hook for the Game Context.
 * @see useDragons
 */
const useGame = () => {
  const dragons = useDragons();
  return { dragons } as GameState;
}

export default useGame
