import "./App.css";
import KorgKonnector from "./KorgKonnector";
import MidiDeviceManager from "./MidiDeviceManager";

function App() {
  return (
    <div className="App">
      <MidiDeviceManager></MidiDeviceManager>
      <KorgKonnector />
    </div>
  );
}

export default App;
