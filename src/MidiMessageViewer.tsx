import React, { useEffect, useState } from "react";

interface MidiMessageViewerProps {
  device: WebMidi.MIDIInput | null;
}

const MidiMessageViewer: React.FC<MidiMessageViewerProps> = ({ device }) => {
  const [messages, setMessages] = useState<Uint8Array[]>([]);

  useEffect(() => {
    if (!device) return;

    const handleMidiMessage = (event: WebMidi.MIDIMessageEvent) => {
      setMessages((prevMessages) => [event.data, ...prevMessages]);
    };

    device.onmidimessage = handleMidiMessage;

    return () => {
      device.onmidimessage = () => {}; // use a no-op function here
    };
  }, [device]);

  return (
    <div>
      <h3>MIDI Messages:</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{Array.from(message).join(", ")}</li>
        ))}
      </ul>
    </div>
  );
};

export default MidiMessageViewer;
