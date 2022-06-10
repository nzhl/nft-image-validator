import fs from "fs";
import { IPFS_GATEWAY, LOG_FILENAME } from "./config";

export const convertToHttpUrl = (url: string) => {
  return url.startsWith("ipfs://") ? url.replace("ipfs://", IPFS_GATEWAY) : url;
};

const log = (info: string) => {
  fs.appendFileSync(LOG_FILENAME, info);
};
export const writeToLog = (info: string, error?: unknown) => {
  log(info);
  if (error) {
    console.error(error);
    if (error instanceof Error) {
      log(`${error.message}\n`);
    } else if (typeof error === "string") {
      log(`${error}\n`);
    } else {
      log("Unknown error\n");
    }
  }
};
