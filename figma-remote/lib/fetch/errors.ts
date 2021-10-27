export type FigmaRemoteErrors = UnauthorizedError | NotfoundError;

export class UnauthorizedError extends Error {
  readonly status = 403;
  readonly type = "UnauthorizedError";
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotfoundError extends Error {
  readonly status = 404;
  readonly type = "NotFound";
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
