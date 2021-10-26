import React from "react";
import "@design-sdk/figma-oauth";
import { getAccessToken_safe } from "@design-sdk/figma-auth-store";
export function useFigmaAuthState() {
  const accessToken_safe = getAccessToken_safe();

  //
}
