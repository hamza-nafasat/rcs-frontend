// seconds as mm:ss, for a voice note or any other clip
const formatDuration = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export { formatDuration };
