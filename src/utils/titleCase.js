// free text arrives however it was typed
export const titleCase = (value) => String(value ?? "").replace(/\b\w/g, (letter) => letter.toUpperCase());
