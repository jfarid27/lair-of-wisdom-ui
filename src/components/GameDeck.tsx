import React, { useContext, useState } from 'react';
import { Grid } from '@material-ui/core';
import { GameContext } from './../context/game';
import { DragonCard } from './DragonCard';

/**
 * Component to show various elements for the Game.
 * @returns ReactComponent
 */
export default function GameDeck() {
  const GameState : any = useContext(GameContext);
  const { dragons } = GameState;
  return (
    <div>
      <h3>Dragons</h3>
      <Grid container className='game-deck'>
        { dragons.map((dragon: any) => (
          <DragonCard dragon={dragon} key={dragon.address} />
        ))}
      </Grid>
      <h3>Eggs</h3>
    </div>
  );
}