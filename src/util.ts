import fs from "fs";
import { IPFS_GATEWAY, LOG_FILENAME } from "./config";

export const convertToHttpUrl = (url: string) => {
  return url.startsWith("ipfs://") ? url.replace("ipfs://", IPFS_GATEWAY) : url;
};

export const writeToLog = (info: string) => {
  fs.appendFile(LOG_FILENAME, info, (error) => {
    console.error("writing log file error");
    console.error(error);
  });
};
