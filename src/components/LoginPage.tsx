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
      <p>An Fantom based MMO RPG. Please <a rel="noreferrer" href="https://docs.fantom.foundation/tutorials/set-up-metamask" target="_blank">setup Fantom</a> and login.</p>
      <Button onClick={() => Login(accountState, dispatch)} variant="outlined" size="large">Login</Button>

      <p><a rel="noreferrer" href="https://nourharidy.medium.com/lair-of-wisdom-on-chain-co-op-pvp-mmo-game-guide-rules-82422209eeb5" target="_blank">Medium</a> | <a href="https://discord.gg/6cw7Edneua" target="_blank" rel="noreferrer">Discord</a></p>
      <p>Game: <a rel="noreferrer" href="https://twitter.com/NourHaridy" target="_blank">@NourHaridy</a></p>
      <p>App: <a rel="noreferrer" href="https://twitter.com/digital_monad" target="_blank">@digital_monad</a></p>
    </div>
  );
}