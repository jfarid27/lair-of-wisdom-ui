import { useEffect } from 'react';
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
import { EggsActionName } from '../hooks/eggs';

const useEggActionStyles = makeStyles((theme) => ({
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

const useCardStyles = makeStyles((theme) => ({
  root: {
    padding: '10px',
    margin: '10px',
    height: 'auto',
  },
}));

interface EggCardProps {
  egg: any
}

interface EggActionProps {
  action: any,
  size: GridSize,
  availableIn: any,
  callData: any,
  classes: any,
  updateCallData: any
}

function EggAction ({ action, size, availableIn, callData, classes, updateCallData}: EggActionProps) {

  const [open, handleClose] = useState(false);
  const actionClasses = useEggActionStyles();

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
 * Component to showcase egg data and drilldown.
 * @returns ReactComponent
 */
export function EggCard({ egg } : EggCardProps) {
  const classesCard = useCardStyles();
  const classesGrid = useActionStyles();
  const [callData, updateCallData] = useState<CallData>({});

  useEffect(() => {
    updateCallData(() => {
      const callDatas: any = {};
      for (const actionName in egg.availableActions) {
        const action = egg.availableActions[actionName]
        if (action.isCallData) {
          callDatas[action.name] = {};
        }
      }
      return callDatas;
    });
  }, [egg, egg.availableActions]);

  return (<Grid item xs={3}>
    <Paper variant="outlined" className={classesCard.root}>
      <Blockies seed={egg.address} size={30} />
      <h3>{egg.name}</h3>
      <h5>Tributes: {egg.numTributes}</h5>
      
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><p>Time Until Hatch</p></TableCell>
            <TableCell><p> </p></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container style={{marginTop: "20px", alignItems: "center"}}>

        <EggAction key={EggsActionName.GiveTribute} action={egg.availableActions[EggsActionName.GiveTribute]} size={12} availableIn={0} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
        <EggAction key={EggsActionName.GiveBirth} action={egg.availableActions[EggsActionName.GiveBirth]} size={12} availableIn={egg.secondsUntilHatched} callData={callData} updateCallData={updateCallData} classes={classesGrid} />
      </Grid>
    </Paper>
  </Grid>)
}