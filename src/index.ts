import shell from "shelljs";
import { Contract } from "ethers";
import {
  CollectionsConfig,
  IMAGE_DIRNAME,
  LOG_FILENAME,
  MAP_FILENAME,
  provider,
  SupportedNFTCollectionItem,
} from "./config";
import getImageUrlByCdn from "./getImageUrlByCdn";
import erc721Abi from "./abi/erc721";
import axios from "axios";
import { convertToHttpUrl, writeToLog } from "./util";
import { writeFileSync } from "fs";

type UrlMap = Record<
  number,
  {
    id: number;
    urlByCdn: string;
    urlFromContract: string;
  }
>;

const buildUrlEntry = async (
  config: SupportedNFTCollectionItem,
  contract: Contract,
  id: number,
  map: UrlMap
) => {
  const { address, tokenName } = config;
  try {
    const metaUrl = await contract.tokenURI(id);
    const metaData = await axios(convertToHttpUrl(metaUrl));
    const urlFromContract = convertToHttpUrl(metaData.data.image);
    const urlByCdn = getImageUrlByCdn(address, id);
    map[id] = {
      id,
      urlByCdn,
      urlFromContract,
    };
    writeToLog(
      `${tokenName}[${id}]: \nurlByCdn:${urlByCdn}\nurlFromContract:${urlFromContract}\n`
    );
  } catch (e) {
    writeToLog(`${tokenName}[${id}]: error occurred while buildUrlEntry\n`, e);
  }
};

const buildUrlMap = async () => {
  const map: Record<string, UrlMap> = {};
  for (const each of Object.values(CollectionsConfig)) {
    const { address, indexFrom, nftType, tokenName } = each;
    map[tokenName] = {};
    if (nftType === "erc721") {
      const contract = new Contract(address, erc721Abi, provider);
      const totalSupply = (await contract.totalSupply()).toNumber();
      for (let id = indexFrom; id < indexFrom + totalSupply; ++id) {
        await buildUrlEntry(each, contract, id, map[tokenName]);
      }
    } else {
      // punks
      // https://etherscan.io/address/0x16f5a35647d6f03d5d3da7b35409d65ba03af3b2#readContract
      // punkImageSvg => png
    }
  }
  return map;
};

const run = async () => {
  shell.rm("-rf", IMAGE_DIRNAME);
  shell.mkdir(IMAGE_DIRNAME);
  shell.rm("-rf", LOG_FILENAME);
  shell.touch(LOG_FILENAME);
  const map = await buildUrlMap();
  shell.rm("-rf", MAP_FILENAME);
  writeFileSync(MAP_FILENAME, JSON.stringify(map, undefined, 2));

  // TODO: download & resize & compare
  // https://github.com/lovell/sharp
  // https://github.com/mapbox/pixelmatch
  // https://github.com/gemini-testing/looks-same
};

run();
