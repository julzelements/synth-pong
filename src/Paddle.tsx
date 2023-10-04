import React, { useEffect, useRef, useState } from "react";

interface PaddleProps {
  device: WebMidi.MIDIInput | null;
}

const mapCoordinateToPixel = (
  coordinate: number,
  maxCoordinate: number,
  containerWidth: number,
  callback: (offset: number) => void
) => {
  const ratio = (coordinate - 1) / (maxCoordinate - 1);
  const pixelOffset = ratio * containerWidth;
  callback(pixelOffset);
};

const Paddle: React.FC<PaddleProps> = ({ device }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Uint8Array[]>([]);
  const [paddleX, setPaddleX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const newContainerWidth = containerRef.current.offsetWidth;
      setContainerWidth(newContainerWidth); // Update containerWidth state
    }

    if (!device) return;

    const handleMidiMessage = (event: WebMidi.MIDIMessageEvent) => {
      if (event.data.toString() === "248") {
        // useless clock message ignore
        return;
      }
      if (
        parseInt(event.data[2].toString()) &&
        parseInt(event.data[1].toString()) === 43
        // 43 is the filter
      ) {
        // set value of paddle here with
        const data = parseInt(event.data[2].toString());
        mapCoordinateToPixel(data, 127, containerWidth, setPaddleX);
      }
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
      <h2>{paddleX}</h2>
      {/* <ul>
        {messages.map((message, index) => (
          <li key={index}>{Array.from(message).join(", ")}</li>
        ))}
      </ul> */}

      <div
        className="pong-container"
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "300px", background: "black" }}
      >
        <div
          className="pong-paddle"
          style={{
            position: "absolute",
            width: "100px",
            height: "20px",
            backgroundColor: "white",
            left: `${paddleX}px`,
            top: "140px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Paddle;
