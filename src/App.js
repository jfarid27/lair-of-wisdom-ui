import logo from './logo.svg';
import './App.css';
import Account from './context/account';
import Main from './components/Main';


function App() {
  return (
    <div className="App">
      <Account>
        <Main />
      </Account>
    </div>
  );
}

export default App;
