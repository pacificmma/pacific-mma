// src/declarations.d.ts
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

// Add declarations for image types if they are not handled by next/image automatically
// or if you're importing them directly for CSS background-image etc.
declare module '*.jpg' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '*.png' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '*.svg' {
  const content: string; // Or import('next/image').StaticImageData; depending on usage
  export default content;
}