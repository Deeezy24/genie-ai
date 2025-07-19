declare namespace Storage {
  type MultipartFile = {
    buffer: Buffer;
    filename: string;
    size: number;
    mimetype: string;
    fieldname: string;
  };
}

declare module "fastify" {
  type FastifyRequest = {
    [x: string]: any;
    storedFiles: Record<string, Storage.MultipartFile[]>;
    body: Record<string, any>; // add this to fix your error
  };
}
