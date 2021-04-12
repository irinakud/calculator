import './App.css';
import Calculator from './Calculator'

function App() {
  return (
    <div className="container-fluid">
      <div id="zero-wrapper">
        <div id="wrapper">
          <div className="wrapper-glare top"></div>
          <div id="root-div">
            <Calculator />
          </div>
          <div className="wrapper-glare bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
