/**
 * Canvas polygon-drawing utilities.
 * Pure rendering and geometry functions for interactive map territory selection.
 */

const DOT_RADIUS = 5;
const SNAP_DISTANCE = 14; // px – distance to first point to auto-close
const LINE_COLOR = "#f97316";
const FILL_COLOR = "rgba(249, 115, 22, 0.18)";
const DOT_COLOR = "#f97316";
const DOT_STROKE = "#ffffff";
const HOVER_DOT_COLOR = "rgba(249, 115, 22, 0.35)";

// ── Geometry helpers ─────────────────────────────────────────────────────────

export const distanceBetween = (a, b) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const isNearPoint = (point, target, threshold = SNAP_DISTANCE) =>
  distanceBetween(point, target) <= threshold;

export const getCanvasPoint = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

// ── Drawing primitives ───────────────────────────────────────────────────────

export const clearCanvas = (ctx, width, height) => {
  ctx.clearRect(0, 0, width, height);
};

export const drawDot = (
  ctx,
  point,
  { radius = DOT_RADIUS, fill = DOT_COLOR, stroke = DOT_STROKE, label = null } = {},
) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  if (label !== null) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(label), point.x, point.y);
  }
};

export const drawLine = (
  ctx,
  from,
  to,
  { color = LINE_COLOR, width = 2, dash = [] } = {},
) => {
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.setLineDash([]);
};

export const fillPolygon = (ctx, points, { color = FILL_COLOR } = {}) => {
  if (points.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

export const strokePolygon = (
  ctx,
  points,
  { color = LINE_COLOR, width = 2 } = {},
) => {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath(); // Connects last point back to first point cleanly
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
};

export const drawAreaLabel = (ctx, point, label, color = "#f97316") => {
  ctx.font = "bold 11px sans-serif";
  const metrics = ctx.measureText(label);
  const padX = 8;
  const padY = 4;
  const w = metrics.width + padX * 2;
  const h = 18;
  const x = point.x - w / 2;
  const y = point.y - h / 2;

  // Background box
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Text
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, point.x, point.y);
};

// ── Redraw Active Polygon ─────────────────────────────────────────────────────

export const redrawPolygon = (
  ctx,
  width,
  height,
  points,
  isClosed,
  cursor,
  color = LINE_COLOR,
  fillColor = FILL_COLOR,
) => {
  if (points.length === 0) return;

  if (isClosed) {
    fillPolygon(ctx, points, { color: fillColor });
    strokePolygon(ctx, points, { color, width: 2.5 });
  } else {
    // Draw edges between placed vertices
    for (let i = 1; i < points.length; i++) {
      drawLine(ctx, points[i - 1], points[i], { color, width: 2.5 });
    }

    // Faded dashed line connecting last point to first point when 3+ points exist
    if (points.length >= 3) {
      drawLine(ctx, points[points.length - 1], points[0], {
        color: "rgba(249, 115, 22, 0.4)",
        width: 1.5,
        dash: [4, 4],
      });
    }

    // Cursor preview line
    if (cursor && points.length > 0) {
      const last = points[points.length - 1];
      const isNearFirst = points.length >= 3 && isNearPoint(cursor, points[0]);

      if (isNearFirst) {
        // Highlight closing line in green
        drawLine(ctx, last, points[0], { color: "#16a34a", width: 3 });
        drawDot(ctx, points[0], {
          radius: DOT_RADIUS + 4,
          fill: "#16a34a",
          stroke: "#ffffff",
        });
      } else {
        drawLine(ctx, last, cursor, { color, width: 2, dash: [5, 4] });
        drawDot(ctx, cursor, { fill: HOVER_DOT_COLOR, stroke: "transparent" });
      }
    }
  }

  // Draw vertex dots with numbers
  points.forEach((p, idx) => {
    drawDot(ctx, p, {
      radius: DOT_RADIUS + 2,
      fill: color,
      stroke: "#ffffff",
      label: idx + 1,
    });
  });
};

// ── Geo Calculations ─────────────────────────────────────────────────────────

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

export const calcPolygonAreaKm2 = (geoPoints) => {
  if (geoPoints.length < 3) return 0;
  let total = 0;
  const n = geoPoints.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = toRad(geoPoints[i].lat);
    const lat2 = toRad(geoPoints[j].lat);
    const dLng = toRad(geoPoints[j].lng - geoPoints[i].lng);
    total += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  return Math.abs((total * EARTH_RADIUS_KM * EARTH_RADIUS_KM) / 2);
};

export const calcCentroid = (geoPoints) => {
  if (geoPoints.length === 0) return { lat: 0, lng: 0 };
  const sum = geoPoints.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 },
  );
  return {
    lat: sum.lat / geoPoints.length,
    lng: sum.lng / geoPoints.length,
  };
};

export const calcBoundingBox = (geoPoints) => {
  if (geoPoints.length === 0) return null;
  const lats = geoPoints.map((p) => p.lat);
  const lngs = geoPoints.map((p) => p.lng);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};
