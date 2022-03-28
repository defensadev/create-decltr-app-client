import Form from "./components/Form";
import StockChart from "./components/StockChart";

// const ws = new WebSocket("ws://localhost:3000/");

// ws.addEventListener("message", console.log);

const App = () => {
  return (
    <div className="flex">
      <Form />
      <StockChart />
    </div>
  );
};

export default App;
