import { useState, useEffect, useContext } from "react";
import { AccountContext } from '../context/account';
import Redeem from '@material-ui/icons/Redeem';
import CakeIcon from '@material-ui/icons/Cake';
import BN from "bn.js";

/**
 * Enumerates the available action names for Eggs.
 */
export enum EggsActionName {
  GiveBirth = "Give Birth",
  GiveTribute = "Give Tribute"
};

/**
 * Holds specific data and calls to execute an entities available action.
 */
interface EggAvailableAction {
  name: EggsActionName,
  Icon: any,
  disabled?: boolean,
  isCallData: boolean,
  callData: Array<String>,
  call: (callData: any) => Promise<void>
}

/**
 * Hold data about a specific instance of an egg.
 */
export interface EggData {
    address: string,
    name: string,
    isHatched: boolean,
    userCanHatch: boolean,
    secondsUntilHached: string,
    numTributes: string,
    availableActions: [EggAvailableAction]
}

export type EggsGameState = Array<EggData>;

/**
 * Updates the eggs game state and data using given contracts.
 * @param {*} contracts
 * @param {*} dispatch
 */
async function updateEggsState(accountState: any, dispatch: any) {
  const { contracts, resetContracts } = accountState;
  try {
    const eggs = await Promise.all(contracts.Eggs.map(async (egg: any) => {
      const [
        name,
        isHatched,
        secondsUntilHached,
        numTributes,
      ] = await Promise.all([
        egg.methods.name().call(),
        egg.methods.isHatched().call(),
        egg.methods.secondsUntilHatched().call(),
        egg.methods.getTributes().call()
      ])

      const userCanHatch = new BN(secondsUntilHached).lte(new BN('0'));

      /**
       * List of availale actions for an instantiated Egg.
       */
      const availableActions: Record<EggsActionName, EggAvailableAction> = {
        [EggsActionName.GiveBirth]: {
          name: EggsActionName.GiveBirth,
          Icon: CakeIcon,
          disabled: !(userCanHatch),
          isCallData: false,
          callData: [],
          call: async (callData: any) => {
            await egg.methods.giveBirth().send({
              from: accountState.address
            })
            resetContracts();
          }
        },
        [EggsActionName.GiveTribute]: {
          name: EggsActionName.GiveTribute,
          Icon: Redeem,
          disabled: false,
          isCallData: false,
          callData: [],
          call: async (callData: any) => {
            await egg.methods.giveTribute().send({
              from: accountState.address
            })
            resetContracts();
          }
        },
      };

      return {
        address: egg.options.address,
        name,
        isHatched,
        userCanHatch,
        secondsUntilHached,
        numTributes,
        availableActions: availableActions
      };
    }));
    dispatch((state: any) => eggs);
  } catch (err) {
    console.log(err)
    // TODO: Setup error handling.
  }
}

/**
 * Hook to expose instantiated egg data from account contracts.
 * @see AccountContext
 * @name useEggs
 * @returns Array of instantiated Eggs.
 */
export const useEggs = () => {
  const { accountState } = useContext(AccountContext);
  const [eggs, dispatch] = useState<EggsGameState>([]);
  useEffect(() => {
    if (!accountState.contracts) return;
    updateEggsState(accountState, dispatch);
  }, [accountState, accountState.contracts]);

  return eggs;
}
