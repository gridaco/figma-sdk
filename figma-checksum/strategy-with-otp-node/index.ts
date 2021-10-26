///
/// A light-weight physical-visual-design-store with temporal node creation & deletion after verification.
///

import { nanoid } from "nanoid/non-secure"; /* we don't need secure id since it will only generate a otp-like hash per user-session */

export class FigmaOTPNodeVerification {
  readonly signature: string;
  private _page: string;
  public get page() {
    return this._page;
  }

  private _node: string;
  public get node() {
    return this._node;
  }

  constructor() {
    this.signature = nanoid();
  }

  async createVerificationNode() {
    if (this._page && this._node) {
      throw new Error("Node already exists");
    }

    const tmp = await createTemporalNodeWithSignature(this.signature);
    this._page = tmp.page;
    this._node = tmp.node;
  }

  clear() {
    figma.getNodeById(this._page).remove();
  }
}

const __fontname = { family: "Roboto", style: "Regular" };
async function createTemporalNodeWithSignature(
  signature: string
): Promise<{ page: string; node: string }> {
  // this must be called before editing text
  await figma.loadFontAsync(__fontname);

  const page = figma.createPage();
  page.name = "🔑 running verification... (will be removed automatically)";

  const holder = figma.createFrame();
  holder.name = "do not remove me while verification";
  holder.resize(0, 0);
  page.appendChild(holder);

  // ---------------- region create node & styling ----------------
  const text = figma.createText();
  holder.appendChild(text);
  text.name = "________________________________________donotmodify"; // 40 '_' + 'donotmodify'
  text.opacity = 0; // to make not editable by double click
  text.visible = true;
  text.characters = signature;
  text.locked = true;
  // --------------------------------------------------------------

  return {
    page: page.id,
    node: holder.id,
  };
}
