import React, { createContext, useState, useEffect } from "react";
import Onboard from 'bnc-onboard';
import Web3 from 'web3';
import setupContracts from "../actions/setupContracts";

/**
 * Makes an async call to the Onboard modal to setup the user account.
 * @param {} state State object to read from.
 * @param {*} updateAppState Dispatch callback to update the state.
 * @async
 */
export const Login = async (state, updateAppState) => {
  const onboard = Onboard({
    networkId: 250,
    networkName: "Fantom Opera",
    subscriptions: {
      wallet: async wallet => {
        const web3 = new Web3(wallet.provider);
        const accounts = await web3.eth.getAccounts();
        updateAppState((st) => {
          state.address = accounts[0];
          st.web3 = web3;
          st.wallet = wallet;
          return { ...st };
        });
      }
    }
  });

  if (state.loggedIn) {
    return;
  }
  await onboard.walletSelect();
  await onboard.walletCheck();
  await Promise.resolve();

  updateAppState((st)  => {
    st.loggedIn = true;
    return { ...st };
  });
}

/**
 * React Context Object.
 */
export const AccountContext = createContext({});

/**
 * Component mixer for the Account Context.
 * @param {*} param0 
 * @returns ReactComponent
 */
export default function Account({ children }) {

  const [accountState, dispatch] = useState({});

  useEffect(() => {
    if (!accountState.loggedIn || !accountState.web3) return;
    setupContracts(accountState, dispatch);
  }, [accountState])

  return <AccountContext.Provider value={ { accountState, dispatch, Login } }>
    { children }
  </AccountContext.Provider>;
}