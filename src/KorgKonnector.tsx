import React, { useState } from "react";
import Paddle from "./Paddle";

const KorgKonnector: React.FC = () => {
  const [midiOutput, setMidiOutput] = useState<WebMidi.MIDIOutput | null>(null);
  const [midiInput, setMidiInput] = useState<WebMidi.MIDIInput | null>(null);

  const connectToMidiOutput = async () => {
    try {
      const access = await navigator.requestMIDIAccess();
      const outputs = Array.from(access.outputs.values());
      const desiredOutput = outputs.find((output) => output.name === "monologue SOUND");
      if (desiredOutput) {
        setMidiOutput(desiredOutput);
      } else {
        console.error("MIDI output device not found");
      }
    } catch (error) {
      console.error("MIDI access request failed", error);
    }
  };
  const connectToMidiInput = async () => {
    try {
      const access = await navigator.requestMIDIAccess();
      const inputs = Array.from(access.inputs.values());
      const desiredInput = inputs.find((input) => input.name === "monologue KBD/KNOB");
      if (desiredInput) {
        setMidiInput(desiredInput);
      } else {
        console.error("MIDI output device not found");
      }
    } catch (error) {
      console.error("MIDI access request failed", error);
    }
  };

  const playMidiNote = (noteNumber: number) => {
    if (!midiOutput) {
      console.log("No output device selected");
      return;
    } else {
      // send MIDI note-on message for C4 (middle C) at maximum velocity
      const noteOnMessage = [0x90, 60, 127];
      midiOutput.send(noteOnMessage);

      // send MIDI note-off message for C4 after 0.5 seconds
      setTimeout(() => {
        const noteOffMessage = [0x80, 60, 0];
        midiOutput.send(noteOffMessage);
      }, 500);
    }
  };

  return (
    <div>
      <h1>MIDI Output Component</h1>
      <button onClick={connectToMidiOutput}>Connect from computer to KORG</button>
      <button onClick={connectToMidiInput}>Connect from KORG to computer</button>
      <button onClick={() => playMidiNote(60)}>Play Note</button>
      <Paddle device={midiInput} />
    </div>
  );
};

export default KorgKonnector;
