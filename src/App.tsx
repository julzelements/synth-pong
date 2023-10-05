import "./App.css";
import KorgKonnector from "./KorgKonnector";
import Pong from "./components/game/Pong";

function App() {
  return (
    <div className="App">
      <Pong />
      <KorgKonnector />
    </div>
  );
}

export default App;
