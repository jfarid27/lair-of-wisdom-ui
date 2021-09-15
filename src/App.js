import logo from './logo.svg';
import './App.css';
import Account from './context/account';
import Main from './components/Main';
import Game from './context/game'


function App() {
  return (
    <div className="App">
      <Account>
        <Game>
          <Main />
        </Game>
      </Account>
    </div>
  );
}

export default App;