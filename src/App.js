import './App.css';
import Calculator from './Calculator'

function App() {
  return (
    <div class="container-fluid">
      <div id="zero-wrapper">
        <div id="wrapper">
          <div class="wrapper-glare top"></div>
          <div id="root-div">
            <Calculator />
          </div>
          <div class="wrapper-glare bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
