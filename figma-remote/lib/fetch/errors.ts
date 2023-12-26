export type FigmaRemoteErrors = UnauthorizedError | NotfoundError;

export class UnauthorizedError extends Error {
  readonly status = 403;
  readonly type = "UnauthorizedError";
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * This error is thrown when the token is expired.
 *
 * Example response:
 * ```
 * {
 *  "status": 403,
 *  "err": "Token expired"
 * }
 * ```
 */
export class TokenExpiredUnauthorizedError extends Error {
  readonly status = 403;
  readonly type = "403_token_expired";
  constructor(message: string) {
    super(message);
    this.name = "403_token_expired";
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
