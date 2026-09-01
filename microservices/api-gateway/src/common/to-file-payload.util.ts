export interface FilePayload {
  originalname: string;
  base64: string;
}

// The default TCP transport is JSON-based and can't carry a raw Buffer, so
// this is what it costs to hand a file off to a service that used to just
// receive it in-process: base64-encode it into the message payload. Fine for
// the mp3/jpg sizes in this demo; a real system would use a dedicated
// media-upload path instead (see microservices/README.md).
export const toFilePayload = (file: Express.Multer.File): FilePayload => ({
  originalname: file.originalname,
  base64: file.buffer.toString('base64'),
});
