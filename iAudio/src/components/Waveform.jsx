import React, { useRef, useEffect } from "react";
import { AudioVisualizer } from "react-audio-visualize";

function AudioWaveform({
  currentTrack,
  currentTime,
  audioRef,
  audioFiles,
  totalDuration = 100,
}) {
  const audioVisualizeRef = useRef(null);

  const AudioVisualCompo = () => {
    return audioVisualizeRef?.current && audioVisualizeRef.current;
  };

  const containerStyle = {
    position: "relative",

    width: `${audioVisualizeRef?.current?.width * audioFiles.length}`, // Set the width of the container
    height: "200px", // Set the height of the container
    overflow: "hidden", // Hide overflow
    border: "1px solid black", // Add border for visualization
  };

  const audioVisualiserContainer = {
    // position: "relative",
    // width: `${200*audioFiles?.length}`,
    // border: "2px solid red",
    // height: "200px",
    // overflow: "hidden"
  };

  const sliderStyle = {
    position: "absolute",
    top: "0",
    left: `${(currentTime / totalDuration) * 100}%`, // Set the left position based on currentTime
    width: "2px", // Set the width of the slider
    height: "100%", // Set the height of the slider to match the container
    backgroundColor: "red", // Customize the color of the slider
  };

  const containerWrapper = {
    // width: '80px',
    height: "auto", // Adjust the height as needed
    overflowX: "auto", // Use 'auto' to hide horizontal overflow
    margin: "0 auto", // Center the container horizontally
    whiteSpace: "nowrap", // Ensure waveforms stay in the same line
  };

  useEffect(() => {
    console.log("width", audioVisualizeRef?.current);
    // if (audioVisualizeRef.current) {
    //   const containerWidth = audioVisualizeRef.current.offsetWidth;
    //   const waveformWidth = containerWidth / audioFiles.length;
    //   const waveformIndex = Math.floor(
    //     (currentTime / visualiserContainer.width) * audioFiles.length
    //   );
    //   const scrollToX = currentTime * waveformWidth - containerWidth / 2;
    //   audioVisualizeRef.current.scrollLeft = scrollToX;
    // }
    if (audioVisualizeRef?.current) {
      const containerWidth = audioVisualizeRef.current.offsetWidth;
      const waveformWidth = containerWidth / audioFiles.length;
      const waveformIndex = Math.floor(
        (currentTime / totalDuration) * audioFiles.length,
      );
      const scrollToX = waveformIndex * waveformWidth - containerWidth / 2;
      audioVisualizeRef.current.scrollLeft = scrollToX;
    }
  }, [currentTime, audioFiles, totalDuration]);

  return (
    <div style={containerWrapper}>
      {/* {audioFiles.map((audio, index) => {
        return (
          <span key={index}>
            <AudioVisualizer
              audioRef={audioRef}
              width={200}
              height={100}
              blob={audio.file}
              barWidth={1}
              backgroundColor="#f3f3f3"
              barColor="#008cba"
              ref={audioVisualizeRef}
              currentTime={currentTime}
            />
          </span>
        );
      })} */}
      <p>Total Duration: {totalDuration} seconds</p>
      <div style={containerStyle}>
        {/* {canvasProps ? <AudioWaveform {...canvasProps} style={{ width: '100%', height: '100%' }} /> : null} */}
        {audioVisualizeRef?.current &&
          audioFiles?.map((audio, index) => {
            return (
              <span key={index}>
                <AudioVisualizer
                  audioRef={audioRef}
                  width={200}
                  height={100}
                  blob={audio.file}
                  barWidth={1}
                  backgroundColor="#f3f3f3"
                  barColor="#008cba"
                  ref={audioVisualizeRef}
                  currentTime={currentTime}
                />
              </span>
            );
          })}
        <div style={sliderStyle} />
      </div>
    </div>
  );
}

export default AudioWaveform;
