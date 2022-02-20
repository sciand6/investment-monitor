import "./App.css";
import StockList from "./components/Stocks/StockList";

function App() {
  return (
    <div className="App">
      <div className="Header">
        <div className="Header-Text">INVESTMENTS</div>
      </div>
      <br />
      <StockList />
    </div>
  );
}

export default App;
