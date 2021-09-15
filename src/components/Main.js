import { useContext } from 'react';
import { AccountContext } from '../context/account';
import LoginPage from './LoginPage';
import GameDeck from './GameDeck';

/**
 * Main view for the application. Switches between loggedIn and non-loggedIn state.
 * @returns ReactComponent
 */
function Main() {
  const { accountState } = useContext(AccountContext);
  return (
    <div className="App">
      { !accountState?.loggedIn ? <LoginPage /> : <GameDeck /> }
    </div>
  );
}

export default Main;