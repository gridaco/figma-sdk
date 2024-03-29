import assert from "assert";
import { nanoid } from "nanoid/non-secure"; /* we don't need secure id since it will only generate a otp-like hash per user-session */
import { getAccessToken } from "@design-sdk/figma-auth-store";

export abstract class FigmaChecksumBase {
  readonly signature: string;
  readonly fileKeyUserProvided: string;
  abstract remoteMethod(): Promise<string>;

  constructor({ filekey, signature }: { filekey: string; signature?: string }) {
    assert(filekey);

    this.signature = signature ?? nanoid();
    this.fileKeyUserProvided = filekey;
  }

  abstract prewarm(): Promise<void>;

  abstract clear();

  private getSignatureRemotely(): Promise<string> {
    return this.remoteMethod();
  }

  async verify(): Promise<boolean> {
    const resultfromRemote = await this.getSignatureRemotely();
    return this.signature == resultfromRemote;
  }

  private __accessToken: string;
  get accessToken(): string {
    return this.__accessToken ?? getAccessToken();
  }

  set accessToken(accessToken: string) {
    this.__accessToken = accessToken;
  }
}
