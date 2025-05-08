import { ErrorRespObject } from "./types";

export const vaccines: string[] = ["pfizer shield", "covishield", "covaxin"];

export const classes: string[] = Array.from(
  { length: 12 },
  (_, i) => `Grade ${i + 1}`
);

export const genders: string[] = ["Male", "Female"];

export const unknownErrorObj: ErrorRespObject = {
  error: "Unknown Error",
  message: "An unknown error occurred",
};
