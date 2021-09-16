import React, { useEffect } from 'react';
import { Grid, Paper, GridSize } from '@material-ui/core';
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
  button: {
    marginBottom: '20px'
  }
}));

const useActionStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '20px'
  },
  
}));

const useNeedsStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '20px'
  },
  
}));

const useCardStyles = makeStyles((theme) => ({
  root: {
    padding: '10px',
    margin: '10px',
    height: 'auto',
  },
}));

interface DragonCardProps {
  dragon: any
}

interface DragonActionProps {
  action: any,
  size: GridSize,
  availableIn: any,
  callData: any,
  classes: any,
  updateCallData: any
}

function DragonAction ({ action, size, availableIn, callData, classes, updateCallData}: DragonActionProps) {

  const [open, handleClose] = useState(false);
  const actionClasses = useDragonActionStyles();

  function handleChange(e: any, item: string) {
    updateCallData((cd: any) => {
      cd[action.name][item] = e.target.value;
      return { ...cd }
    })
  }

  return <Grid item xs={size}>
    <Grid container>
      <Grid item xs={12}>
        <Button fullWidth variant="outlined" onClick={() => handleClose(true)} className={actionClasses.button} disabled={action.disabled}>
          <action.Icon />
          <p>&nbsp;{action.name}</p>
          {action.disabled && availableIn > 0 && (
            <p>&nbsp;~ {availableIn} secs</p>
          )}
        </Button>
      </Grid>
    </Grid>
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
  const classesNeedsGrid = useNeedsStyles();
  const [callData, updateCallData] = useState<CallData>({});

  useEffect(() => {
    updateCallData(() => {
      const callDatas: any = {};
      for (const actionName in dragon.availableActions) {
        const action = dragon.availableActions[actionName]
        if (action.isCallData) {
          callDatas[action.name] = {};
        }
      }
      return callDatas;
    });
  }, [dragon, dragon.availableActions]);

  return (<Grid item xs={3}>
    <Paper variant="outlined" className={classesCard.root}>
      <Blockies seed={dragon.address} size={30} />
      <h3>{dragon.name}</h3>
      <h5>Trust: {dragon.playerTrust}</h5>
      
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><p>Health</p></TableCell>
            <TableCell><p>{dragon.health} / {dragon.maxHealth} ({dragon.healthPercent.toString()}%)</p></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Health Regen</p></TableCell>
            <TableCell>{dragon.healthRegeneration}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Damage</p></TableCell>
            <TableCell>{dragon.damage}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><p>Attack Cooldown</p></TableCell>
            <TableCell>{dragon.attackCooldown}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container style={{marginTop: "20px", alignItems: "center"}}>
        <Grid key={dragon.availableActions.feed.name+'-score'} item xs={6} classes={classesNeedsGrid} > Hunger : {dragon.getHunger}</Grid>
        <DragonAction key={dragon.availableActions.feed.name} action={dragon.availableActions.feed} size={6} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <Grid key={dragon.availableActions.sleep.name+'-score'} item xs={6} classes={classesNeedsGrid} > Sleepiness : {dragon.getSleepiness}</Grid>
        <DragonAction key={dragon.availableActions.sleep.name} action={dragon.availableActions.sleep} size={6} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <Grid key={dragon.availableActions.clean.name+'-score'} item xs={6} classes={classesNeedsGrid} > Uncleanliness : {dragon.getUncleanliness}</Grid>
        <DragonAction key={dragon.availableActions.clean.name} action={dragon.availableActions.clean} size={6} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <Grid key={dragon.availableActions.play.name+'-score'} item xs={6} classes={classesNeedsGrid} > Boredom : {dragon.getBoredom}</Grid>
        <DragonAction key={dragon.availableActions.play.name} action={dragon.availableActions.play} size={6} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        
        <DragonAction key={dragon.availableActions.heal.name} action={dragon.availableActions.heal} size={12} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <DragonAction key={dragon.availableActions.attack.name} action={dragon.availableActions.attack} size={12} availableIn={dragon.realSecondsUntilAttack.toNumber()} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <DragonAction key={dragon.availableActions.proposeBreed.name} action={dragon.availableActions.proposeBreed} size={12} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <DragonAction key={dragon.availableActions.acceptBreed.name} action={dragon.availableActions.acceptBreed} size={12} availableIn={dragon.realSecondsUntilBreed.toNumber()} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
      </Grid>
    </Paper>
  </Grid>)

  /*{ dragon.availableActions.map((action: any) => (
          <DragonAction key={action.name} action={action} size={12} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        ))}*/
}