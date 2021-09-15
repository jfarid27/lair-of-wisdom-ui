import React, { useContext, useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Blockies from 'react-blockies';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  return (<Grid item xs={3}>
    <Paper variant="outlined" className={classes.root}>
      <Blockies seed={dragon.address} />
      <h3>{dragon.name}</h3>
      <h5>Trust: {dragon.playerTrust}</h5>
      
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
            <TableCell><p>Attack Cooldown</p></TableCell>
            <TableCell>{dragon.attackCooldown}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Your Trust</p></TableCell>
            <TableCell>{dragon.playerTrust}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
    </Paper>
  </Grid>)
}