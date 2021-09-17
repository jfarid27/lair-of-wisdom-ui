import React, { createContext, useState, useEffect } from "react";
import Onboard from 'bnc-onboard';
import Web3 from 'web3';
import setupContracts from "../actions/setupContracts";

/**
 * Holds logged in account data and information about the current web3 provider.
 * @name AccountState
 */
interface AccountState {
  address?: string,
  web3?: any,
  wallet?: any,
  loggedIn?: boolean,
  contracts?: any
}

/**
 * Makes an async call to the Onboard modal to setup the user account.
 * @param {} state State object to read from.
 * @param {*} updateAppState Dispatch callback to update the state.
 * @async
 */
export const Login = async (state: AccountState, updateAppState: React.Dispatch<React.SetStateAction<AccountState>>) => {
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
          st.web3.eth.defaultAccount = accounts[0];
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

interface AccountContextInterface {
  accountState: AccountState,
  dispatch?: any,
  Login: any,
  resetContracts?: any
}

/**
 * React Context Object for web3 login and account information.
 */
export const AccountContext = createContext<AccountContextInterface>({
  accountState: {},
  Login
});

/**
 * Component mixer for the Account Context.
 * @name AccountContext
 * @see AccountState
 * @returns ReactComponent
 */
const Account: React.FC = ({ children }) => {
  const [accountState, dispatch] = useState<AccountState>({});
  useEffect(() => {
    if (accountState.contracts) return;
    setupContracts(accountState, dispatch);
  }, [accountState, accountState.loggedIn, accountState.web3]);

  const resetContracts = () => {
    dispatch((st: AccountState) => {
      delete st.contracts;
      return { ...st };
    })
  }

  return <AccountContext.Provider value={ { accountState, dispatch, Login, resetContracts } }>
    { children }
  </AccountContext.Provider>;
}

export default Account