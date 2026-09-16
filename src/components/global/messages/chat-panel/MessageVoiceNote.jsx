import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Check, Mic, X } from "lucide-react";
import { formatDuration } from "../../../../utils/formatDuration";

const BAR_COUNT = 28;
const QUIET_BAR = 0.12;

const MessageVoiceNote = ({ onRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startedAtRef = useRef(0);
  const isCancelledRef = useRef(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const barsRef = useRef([]);

  // the counter runs while recording
  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // bars driven straight from the analyser
  useEffect(() => {
    if (!isRecording || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const samples = new Uint8Array(analyser.frequencyBinCount);
    const perBar = Math.floor(samples.length / BAR_COUNT);
    let frame = requestAnimationFrame(function draw() {
      analyser.getByteTimeDomainData(samples);

      barsRef.current.forEach((bar, index) => {
        if (!bar) return;
        let peak = 0;
        for (let sample = index * perBar; sample < (index + 1) * perBar; sample += 1) {
          peak = Math.max(peak, Math.abs(samples[sample] - 128) / 128);
        }
        bar.style.transform = `scaleY(${Math.min(1, Math.max(QUIET_BAR, peak * 2.4))})`;
      });

      frame = requestAnimationFrame(draw);
    });

    return () => cancelAnimationFrame(frame);
  }, [isRecording]);

  // never leave the mic on
  useEffect(() => () => recorderRef.current?.stream?.getTracks?.().forEach((track) => track.stop()), []);

  const releaseMic = () => {
    recorderRef.current?.stream?.getTracks?.().forEach((track) => track.stop());
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
  };

  const listenForLevels = (stream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    audioContext.createMediaStreamSource(stream).connect(analyser);
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      isCancelledRef.current = false;
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        releaseMic();
        if (isCancelledRef.current) return;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        // the clock, not the counter
        onRecorded({
          blob,
          url: URL.createObjectURL(blob),
          duration: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
        });
      };

      recorder.start();
      recorderRef.current = recorder;
      listenForLevels(stream);
      setSeconds(0);
      setIsRecording(true);
    } catch (error) {
      console.error("Voice note error:", error);
      toast.error("Microphone permission is needed to record a voice note.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const cancelRecording = () => {
    isCancelledRef.current = true;
    stopRecording();
  };

  if (!isRecording)
    return (
      <button
        type="button"
        onClick={startRecording}
        aria-label="Record voice note"
        className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
      >
        <Mic className="h-5 w-5" />
      </button>
    );

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-red-50 px-3 py-1.5">
      <span className="shrink-0 text-xs tabular-nums text-red-600">{formatDuration(seconds)}</span>

      {/* what the mic is hearing right now */}
      <div className="flex h-6 min-w-0 flex-1 items-center justify-center gap-0.75 overflow-hidden">
        {Array.from({ length: BAR_COUNT }).map((_, index) => (
          <span
            key={index}
            ref={(element) => {
              barsRef.current[index] = element;
            }}
            style={{ transform: `scaleY(${QUIET_BAR})` }}
            className="h-6 w-0.75 origin-center rounded-full bg-red-400 transition-transform duration-75 ease-out"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={cancelRecording}
        aria-label="Cancel recording"
        className="shrink-0 rounded-full p-1 text-red-500 transition-colors hover:bg-red-100"
      >
        <X className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={stopRecording}
        aria-label="Save voice note"
        className="shrink-0 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MessageVoiceNote;
