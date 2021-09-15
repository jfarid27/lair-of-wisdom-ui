import React, { useContext, useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
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
      <h3>{dragon.name}</h3>
    </Paper>
  </Grid>)
}