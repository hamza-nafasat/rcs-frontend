import { useRef, useState } from "react";
import { Eraser } from "lucide-react";
import Button from "../../shared/Button";
import Input from "../../shared/Input";
import SegmentedControl from "../../shared/SegmentedControl";

const CANVAS_SIZE = { width: 520, height: 170 };
const SCRIPT_FONT = "'Snell Roundhand', 'Brush Script MT', 'Segoe Script', cursive";

// quieter than the tool cards
const SIGNATURE_MODES = [
  { value: "type", label: "Type it", activeClassName: "bg-primary text-primary" },
  { value: "draw", label: "Draw it", activeClassName: "bg-primary text-primary" },
];

// the typed name as png
const typedSignatureToImage = (name) => {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE.width;
  canvas.height = CANVAS_SIZE.height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#111827";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `88px ${SCRIPT_FONT}`;
  context.fillText(name.trim(), canvas.width / 2, canvas.height / 2, canvas.width - 24);
  return canvas.toDataURL("image/png");
};

// type or draw a signature
const SignatureCreator = ({ onCreate }) => {
  const [mode, setMode] = useState("type");
  const [name, setName] = useState("");
  const [hasDrawing, setHasDrawing] = useState(false);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const pointOf = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_SIZE.width,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_SIZE.height,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const context = canvasRef.current.getContext("2d");
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
    const { x, y } = pointOf(event);
    context.beginPath();
    context.moveTo(x, y);
    isDrawingRef.current = true;
    canvasRef.current.setPointerCapture(event.pointerId);
  };

  const draw = (event) => {
    if (!isDrawingRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const { x, y } = pointOf(event);
    context.lineTo(x, y);
    context.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const handleCreate = () => {
    onCreate?.(mode === "type" ? typedSignatureToImage(name) : canvasRef.current.toDataURL("image/png"));
  };

  const isReady = mode === "type" ? name.trim() !== "" : hasDrawing;

  return (
    <section className="flex flex-col gap-3">
      <SegmentedControl value={mode} onChange={setMode} options={SIGNATURE_MODES} />

      {mode === "type" ? (
        <>
          <Input
            label="Your name"
            name="signatureName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Hamza Nafasat"
          />
          <p
            className="flex h-24 items-center justify-center rounded-xl border color-border bg-muted text-4xl text-tertiary"
            style={{ fontFamily: SCRIPT_FONT }}
          >
            {name.trim() || "Your signature"}
          </p>
        </>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="h-40 w-full touch-none rounded-xl border color-border bg-white"
          />

          <Button
            variant="bare"
            onClick={clearDrawing}
            icon={<Eraser size={14} />}
            className="absolute right-2 top-2 rounded-lg border color-border bg-white px-2! py-1! text-xs text-secondary"
          >
            Clear
          </Button>
        </div>
      )}

      <Button onClick={handleCreate} isDisabled={!isReady} className="px-4! py-2! text-sm">
        Use this signature
      </Button>
    </section>
  );
};

export default SignatureCreator;
