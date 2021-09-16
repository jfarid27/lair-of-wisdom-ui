import './App.css';
import Account from './context/account';
import Main from './components/Main';
import Game from './hooks/game'


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