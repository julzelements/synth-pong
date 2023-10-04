import React from 'react';

interface MidiConnectionStatusProps {
  selectedDevice: WebMidi.MIDIInput | null;
}

const MidiConnectionStatus: React.FC<MidiConnectionStatusProps> = ({ selectedDevice }) => {
  let statusText = 'No device selected';

  if (selectedDevice) {
    statusText = `Connected to device: ${selectedDevice.name}`;
  }

  return <p>{statusText}</p>;
};

export default MidiConnectionStatus;
