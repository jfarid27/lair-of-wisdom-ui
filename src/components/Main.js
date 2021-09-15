import { useContext } from 'react';
import { AccountContext } from '../context/account';
import { Button } from '@material-ui/core';

/**
 * Login Component showing the button interaction for users to login.
 * @returns ReactComponent
 */
function LoginPage() {
  const { accountState, Login, dispatch } = useContext(AccountContext);
  return (
    <div>
      <h1>Lair of Wisdom</h1>
      <p>An Ethereum based MMO RPG.</p>
      <Button onClick={() => Login(accountState, dispatch)} variant="outlined" size="large">Login</Button>
    </div>
  );
}

/**
 * Main view for the application. Switches between loggedIn and non-loggedIn state.
 * @returns ReactComponent
 */
function Main() {
  const { accountState } = useContext(AccountContext);
  return (
    <div className="App">
      { !accountState?.loggedIn ? <LoginPage /> : accountState.address }
    </div>
  );
}

export default Main;