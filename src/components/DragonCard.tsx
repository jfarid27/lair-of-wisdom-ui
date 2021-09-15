import React, { useEffect } from 'react';
import { Grid, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Blockies from 'react-blockies';
import { useState } from 'react';

const useDragonActionStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '$50%',
    left: '$50%',
    transform: 'translate(100%, 100%)'
  },
}));

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

interface DragonActionProps {
  action: any,
  callData: any,
  classes: any,
  updateCallData: any
}

function DragonAction ({ action, callData, classes, updateCallData}: DragonActionProps) {

  const [open, handleClose] = useState(false);
  const actionClasses = useDragonActionStyles();

  function handleChange(e: any, item: string) {
    updateCallData((cd: any) => {
      cd[action.name][item] = e.target.value;
      return { ...cd }
    })
  }

  return <Grid item xs={3} key={action.name}>
    <Paper variant="outlined" onClick={() => handleClose(true)} className={classes.root}>
      <action.Icon />
      <p>{action.name}</p>
    </Paper>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={action.name + "-confirmation-modal"}
      aria-describedby="Modal to confirm sending action."
    >
      <div className={actionClasses.modal}>
        <action.Icon />
        <h1>{action.name}</h1>
        { action.callData.map((item: any) => (
        <input type="text" value={callData[action.name]} onChange={e => handleChange(e, item)} />
        ))}
        <Button color="primary" variant="contained" fullWidth onClick={() => action.call(callData[action.name])}>Confirm</Button>
        <Button fullWidth onClick={() => handleClose(false)}>Cancel</Button>
      </div>
    </Modal>
  </Grid>
}


interface CallData {
  [k: string]: {
    [j: string]: string
  }
}

/**
 * Component to showcase dragon data and drilldown.
 * @param param0 React props.
 * @returns ReactComponent
 */
export function DragonCard({ dragon } : DragonCardProps) {
  const classesCard = useCardStyles();
  const classesGrid = useActionStyles();
  const [callData, updateCallData] = useState<CallData>({});

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
          <DragonAction action={action} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
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