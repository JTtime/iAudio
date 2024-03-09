//
// components/AudioPlayer.js
import { useRef, useState, useEffect } from "react";
import SortableList from "./components/AudioList";
import { v4 as uuidv4 } from "uuid";
import AudioWaveform from "./components/Waveform";
import Seekbar from "./components/Seekbar";
import { useStrictDroppable } from "./components/useStrictDroppable";

function AudioPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackTime, setCurrentTrackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const [enabled] = useStrictDroppable(loading);
  const audioRef = useRef(null);
  const seekbarRef = useRef(null);

  // const totalTime = totalDuration.reduce((acc, curr) => acc + curr, 0);

  const calculateCurrentTime = () => {
    // Sum of durations of all previous tracks

    setCurrentTrackTime(audioRef?.current.currentTime);

    const previousDurationSum = audioFiles
      .slice(0, currentAudioIndex) // Slice the array up to the current track
      .reduce((acc, obj) => acc + obj.duration, 0);

    // Current time of the current track

    // Total current time is the sum of previous durations and the current time of the current track
    return previousDurationSum + currentTrackTime;
  };

  useEffect(() => {
    setLoading(true);
    const audio = audioRef.current;
    // const newTotalDuration = audioFiles.reduce((acc, obj) => acc + obj.duration, 0);
    setTotalDuration(audioFiles.reduce((acc, obj) => acc + obj.duration, 0));

    const newCurrentTime = calculateCurrentTime();
    setCurrentTime(newCurrentTime);

    console.log("audioFiles", audioFiles);

    if (audioFiles.length > 0) {
      audio.src = audioFiles[currentAudioIndex].url;
      audio.load();
      // setCurrentTime(0);
      audio.play();
    }

    // const intervalId = setInterval(() => {
    //   setCurrentTime(audio.currentTime);
    // }, 500);

    setCurrentFileName(audioFiles[currentAudioIndex]?.file?.name);

    setLoading(false);

    // return () => clearInterval(intervalId);
  }, [audioFiles, currentAudioIndex]);

  const handleSeek = async (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTrackTime(newTime);
    audioRef.current.currentTime = newTime;
    const newCurrentTime = await calculateCurrentTime();
    setCurrentTime(newCurrentTime);
  };

  const mDur = () => {
    // setTotalDuration([...totalDuration, audioRef.current.duration]);
    seekbarRef.current.max = audioRef.current.duration;
    // seekbarRef.current.max = totalDuration;
    console.log("from mPlay", totalDuration);
    console.log(audioFiles);
  };

  const mPlay = async () => {
    setCurrentTrackTime(audioRef.current.currentTime);
    // handleSeek()
    const newCurrentTime = await calculateCurrentTime();
    setCurrentTime(newCurrentTime);
  };

  const getAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
      audio.addEventListener("error", (e) => {
        reject(e);
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    setLoading(true);
    const newAudioFile = await Promise.all(
      Array.from(e.target.files).map(async (file) => {
        const duration = await getAudioDuration(file);
        return {
          id: uuidv4(),
          url: URL.createObjectURL(file),
          file,
          duration: duration,
        };
      }),
    );

    setAudioFiles([...audioFiles, ...newAudioFile]);
    setCurrentAudioIndex(audioFiles.length); // Set currentAudioIndex to the new audio file index
    mDur();
    setLoading(false);
    console.log("newaudiofile", audioFiles);
  };

  const playNextAudio = () => {
    if (currentAudioIndex < audioFiles.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      setCurrentAudioIndex(0);
    }
    // audioRef.current.play();
  };

  const playPrevAudio = () => {
    if (currentAudioIndex === 0) {
      setCurrentAudioIndex(audioFiles.length - 1);
    } else {
      setCurrentAudioIndex(currentAudioIndex - 1);
    }
    // audioRef.current.play();
  };

  const AudioSeekBar = () => {
    return (
      <>
        <AudioWaveform audioFiles={audioFiles} audioRef={audioRef} />{" "}
      </>
    );
  };

  return (
    <div>
      <SortableList
        enabled={enabled}
        items={audioFiles}
        setItems={setAudioFiles}
      />
      <input
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileChange}
        style={{ margin: 20 }}
      />
      <hr />
      <audio
        autoPlay
        ref={audioRef}
        controls
        onEnded={playNextAudio}
        preload="metadata"
        onLoadedMetadata={mDur}
        onTimeUpdate={mPlay}
      >
        Your browser does not support the audio element.
      </audio>
      {/* <input
        type="range"
        min={0}
        max={audioRef?.current?.duration || 0}
        value={currentTrackTime || 0}
        onChange={handleSeek}
        ref={seekbarRef}
        step={0.25}
      /> */}
      <div style={{ margin: 20 }}>
        <button style={{ marginRight: 20 }} onClick={playPrevAudio}>
          Previous
        </button>
        <button onClick={playNextAudio}>Next</button>
        {currentFileName && (
          <p>
            <strong>Playing: </strong> {currentFileName}
          </p>
        )}
      </div>

      <AudioWaveform
        audioFiles={audioFiles}
        audioRef={audioRef}
        currentTime={currentTime}
        totalDuration={totalDuration}
        currenTrack={audioFiles[currentAudioIndex]?.id}
      />

      {/* <Seekbar currentTime={currentTime}  /> */}
    </div>
  );
}

export default AudioPlayer;
