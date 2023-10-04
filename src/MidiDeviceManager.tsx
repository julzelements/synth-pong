import React, { useState, useEffect } from "react";
import MidiConnectionStatus from "./MidiConnectionStatus";
import MidiMessageViewer from "./MidiMessageViewer";

const MidiDeviceManager: React.FC = () => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<WebMidi.MIDIInput | null>(null);
  const [deviceList, setDeviceList] = useState<WebMidi.MIDIInput[]>([]);
  const [outputDeviceList, setOutputDeviceList] = useState<WebMidi.MIDIOutput[]>([]);
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<WebMidi.MIDIOutput | null>(null);
  const [defaultInputDevice, setDefaultInputDevice] = useState<WebMidi.MIDIInput | null>(null);
  const [defaultOutputDevice, setDefaultOutputDevice] = useState<WebMidi.MIDIOutput | null>(null);

  const requestMIDIAccess = async () => {
    if (!navigator.requestMIDIAccess) {
      console.log("WebMIDI is not supported in this browser.");
      return;
    }
    try {
      const access = await navigator.requestMIDIAccess({ sysex: true });
      setMidiAccess(access);
      let defaultInputDevice = null;
      let defaultOutputDevice = null;

      // Search for the default input and output devices
      let inputs: WebMidi.MIDIInput[] = [];
      access.inputs.forEach((input) => {
        inputs.push(input);
        if (input.name === "monologue KBD/KNB") {
          defaultInputDevice = input;
        }
      });
      setDeviceList(inputs);
      setDefaultInputDevice(defaultInputDevice);

      let outputs: WebMidi.MIDIOutput[] = [];
      access.outputs.forEach((output) => {
        outputs.push(output);
        if (output.name === "monologue SOUND") {
          defaultOutputDevice = output;
        }
      });
      setOutputDeviceList(outputs);
      setDefaultOutputDevice(defaultOutputDevice);
    } catch (err) {
      console.log("Could not access the MIDI devices.");
    }
  };

  useEffect(() => {
    requestMIDIAccess();
  }, []);

  useEffect(() => {
    if (!midiAccess) return;
    const updateDevices = () => {
      let inputs: WebMidi.MIDIInput[] = [];
      midiAccess.inputs.forEach((input) => inputs.push(input));
      let outputs: WebMidi.MIDIOutput[] = [];
      midiAccess.outputs.forEach((output) => outputs.push(output));
      setOutputDeviceList(outputs);
      let defaultInputDevice = null;
      let defaultOutputDevice = null;
      midiAccess.inputs.forEach((input) => {
        if (input.name === "monologue KBD/KNB") {
          defaultInputDevice = input;
        }
      });
      midiAccess.outputs.forEach((output) => {
        if (output.name === "monologue SOUND") {
          defaultOutputDevice = output;
        }
      });
      setDefaultInputDevice(defaultInputDevice);
      setDefaultOutputDevice(defaultOutputDevice);
    };

    midiAccess.onstatechange = updateDevices;
  }, [midiAccess]);

  const handleInputDeviceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    console.log(deviceList)
    const device = deviceList.find((device) => device.id === id);
    setSelectedDevice(device || null);
  };

  const handleOutputDeviceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const device = outputDeviceList.find((device) => device.id === id);
    setSelectedOutputDevice(device || null);
  };

  const handleTestButtonClick = () => {
    if (!selectedOutputDevice) {
      console.log("No output device selected");
      return;
    }

    // send MIDI note-on message for C4 (middle C) at maximum velocity
    const noteOnMessage = [0x90, 60, 127];
    selectedOutputDevice.send(noteOnMessage);

    // send MIDI note-off message for C4 after 0.5 seconds
    setTimeout(() => {
      const noteOffMessage = [0x80, 60, 0];
      selectedOutputDevice.send(noteOffMessage);
    }, 500);
  };

  // I still need to manually trigger the connection of the default devices
  // But the selection of them is working well.

  const defaultInputDeviceId = defaultInputDevice ? defaultInputDevice.id : '';
  const defaultOutputDeviceId = defaultOutputDevice ? defaultOutputDevice.id : '';

  return (
    <div>
      <select onChange={handleInputDeviceSelection}>
        <option>Select an input device...</option>
        {deviceList.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
      <select onChange={handleOutputDeviceSelection}>
        <option>Select an output device...</option>
        {outputDeviceList.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
      <button onClick={requestMIDIAccess}>Re-connect</button>
      <MidiConnectionStatus selectedDevice={selectedDevice} />
      <button onClick={handleTestButtonClick}>Test C4 Note</button>
      {selectedDevice && <MidiMessageViewer device={selectedDevice} />}
    </div>
  );
};

export default MidiDeviceManager;
