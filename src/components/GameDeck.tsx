import { Grid } from '@material-ui/core';
import useGame from '../hooks/game';
import { DragonCard } from './DragonCard';

/**
 * Component to show various elements for the Game.
 * @returns ReactComponent
 */
export default function GameDeck() {
  const gameState = useGame();
  const { dragons } = gameState;
  return (
    <div>
      <h3>Dragons</h3>
      {
        dragons ? <Grid container className='game-deck'>
          { dragons.map((dragon: any) => (
            <DragonCard dragon={dragon} key={dragon.address} />
          ))}
        </Grid> : <h6>Hang tight...</h6>
      }
      
      <h3>Eggs</h3>

      <h6>Under construction.</h6>
    </div>
  );
}