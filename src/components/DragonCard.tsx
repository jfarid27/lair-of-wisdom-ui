import React, { useEffect } from 'react';
import { Grid, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Blockies from 'react-blockies';
import { useState } from 'react';

const useActionStyles = makeStyles((theme) => ({
  root: {
    padding: '10px',
    margin: '10px',
    cursor: 'pointer'
  },
}));

const useCardStyles = makeStyles((theme) => ({
  root: {
    padding: '10px',
    margin: '10px'
  },
}));

interface DragonCardProps {
  dragon: any
}


/**
 * Component to showcase dragon data and drilldown.
 * @param param0 React props.
 * @returns ReactComponent
 */
export function DragonCard({ dragon } : DragonCardProps) {
  const classesCard = useCardStyles();
  const classesGrid = useActionStyles();
  const [callData, updateCallData] = useState<any>({});

  useEffect(() => {
    updateCallData(() => {
      const callDatas: any = {};
      for (const action of dragon.availableActions) {
        if (action.isCallData) {
          callDatas[action.name] = {};
        }
      }
      return callDatas;
    });
  }, [dragon, dragon.availableActions]);

  return (<Grid item xs={3}>
    <Paper variant="outlined" className={classesCard.root}>
      <Blockies seed={dragon.address} />
      <h3>{dragon.name}</h3>
      <h5>Trust: {dragon.playerTrust}</h5>
      <Grid container>
        { dragon.availableActions.map((action: any) => (
          <Grid item xs={3} key={action.name}>
            <Paper variant="outlined" onClick={() => action.call(callData[action.name])} className={classesGrid.root}>
              <action.Icon />
              <p>{action.name}</p>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><p>Health</p></TableCell>
            <TableCell>{dragon.health}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Max Health</p></TableCell>
            <TableCell>{dragon.maxHealth}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Damage</p></TableCell>
            <TableCell>{dragon.damage}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Attack Cooldown</p></TableCell>
            <TableCell>{dragon.attackCooldown}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Health Regen.</p></TableCell>
            <TableCell>{dragon.healthRegeneration}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
    </Paper>
  </Grid>)
}