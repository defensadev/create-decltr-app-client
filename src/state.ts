import { atom } from "recoil";

import { DecltrDevEvent } from "./types";

export const devEventAtom = atom<DecltrDevEvent | null>({
  key: "devEvent",
  default: null,
});
