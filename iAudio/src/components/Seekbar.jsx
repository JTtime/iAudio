import React from "react";
import AudioWaveform from "./Waveform";

function CustomCanvasContainer({
  totalDuration = 100,
  currentTime,
  canvasProps,
}) {
  // const totalDuration = timeArray.reduce((acc, curr) => acc + curr, 0);
  const containerStyle = {
    position: "relative",
    // width: '100%', // Set the width of the container
    height: "200px", // Set the height of the container
    overflow: "hidden", // Hide overflow
    border: "1px solid black", // Add border for visualization
  };

  const sliderStyle = {
    position: "absolute",
    top: "0",
    left: `${(currentTime / totalDuration) * 100}%`, // Set the left position based on currentTime
    width: "2px", // Set the width of the slider
    height: "100%", // Set the height of the slider to match the container
    backgroundColor: "red", // Customize the color of the slider
  };

  return (
    <div style={containerStyle}>
      {/* {canvasProps ? <AudioWaveform {...canvasProps} style={{ width: '100%', height: '100%' }} /> : null} */}
      {canvasProps && <canvasProps currentTime={currentTime} />}
      <div style={sliderStyle} />
    </div>
  );
}

export default CustomCanvasContainer;
