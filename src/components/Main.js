import { useContext } from 'react';
import { AccountContext } from '../context/account';

function Main() {
  const { accountState, Login, dispatch } = useContext(AccountContext);

  return (
    <div className="App">
      { !accountState?.loggedIn ? 
        <button onClick={() => Login(accountState, dispatch)}>Login</button> :
        accountState.address
      }
    </div>
  );
}

export default Main;