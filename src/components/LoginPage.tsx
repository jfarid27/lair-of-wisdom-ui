import { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AccountContext } from '../context/account';

/**
 * Login Component showing the button interaction for users to login.
 * @returns ReactComponent
 */
export default function LoginPage() {
  const { accountState, Login, dispatch } : any = useContext(AccountContext);
  return (
    <div className="login-page">
      <h1>Lair of Wisdom</h1>
      <p>An Fantom based MMO RPG. Please <a href="https://docs.fantom.foundation/tutorials/set-up-metamask" target="_blank">setup Fantom</a> and login.</p>
      <Button onClick={() => Login(accountState, dispatch)} variant="outlined" size="large">Login</Button>
    </div>
  );
}