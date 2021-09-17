import { Grid } from '@material-ui/core';
import { useDragons } from '../hooks/dragons';
import { useEggs } from '../hooks/eggs';
import { DragonCard } from './DragonCard';
import { EggCard } from './EggCard';

/**
 * Component to show various elements for the Game.
 * @returns ReactComponent
 */
export default function GameDeck() {
  const dragons = useDragons();
  const eggs = useEggs();
  return (
    <div>
      <h3>Dragons</h3>
      {
        (dragons && dragons.length > 0) ? 
        <Grid container className='game-deck'>
          { dragons.map((dragon: any) => (
            <DragonCard dragon={dragon} key={dragon.address} />
          ))}
        </Grid> : <h6>Hang tight...</h6>
      }
      
      <h3>Eggs</h3>

      {
        (eggs && eggs.length > 0) ? 
        <Grid container className='game-deck'>
          { eggs.map((egg: any) => (
            <EggCard egg={egg} key={egg.address} />
          ))}
        </Grid> : <h6>Hang tight...</h6>
      }
    </div>
  );
}