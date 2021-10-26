import assert from "assert";
import { nanoid } from "nanoid/non-secure"; /* we don't need secure id since it will only generate a otp-like hash per user-session */

export abstract class FigmaChecksumBase {
  readonly signature: string;
  readonly fileKeyUserProvided: string;
  abstract readonly remoteMethod: () => Promise<string>;

  constructor({ filekey }: { filekey: string }) {
    assert(filekey);

    this.signature = nanoid();
    this.fileKeyUserProvided = filekey;
  }

  abstract prewarm(): Promise<void>;

  abstract clear();

  private getSignatureRemotely(): Promise<string> {
    return this.remoteMethod();
  }

  async checksum(): Promise<boolean> {
    return this.signature == (await this.getSignatureRemotely());
  }
}
