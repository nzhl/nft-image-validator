import shell from "shelljs";
import looksSame from "looks-same";
import { Contract } from "ethers";
import {
  CollectionsConfig,
  IMAGE_DIRNAME,
  LOG_FILENAME,
  provider,
  SupportedNFTCollectionItem,
} from "./config";
import getImageUrlByCdn from "./getImageUrlByCdn";
import erc721Abi from "./abi/erc721";
import axios from "axios";
import { convertToHttpUrl } from "./util";

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
    console.info(
      `${tokenName}[${id}]: \nurlByCdn:${urlByCdn}\nurlFromContract:${urlFromContract}\n`
    );
  } catch (e) {
    console.error(`${tokenName}[${id}]: error !`);
    console.error(e);
    return;
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
        buildUrlEntry(each, contract, id, map[tokenName]);
      }
    } else {
      // punks
    }
  }
};

const run = async () => {
  shell.rm("-rf", IMAGE_DIRNAME);
  shell.mkdir(IMAGE_DIRNAME);
  shell.rm("-rf", LOG_FILENAME);
  shell.touch(LOG_FILENAME);
  await buildUrlMap();

  // BAYC
  // console.log("diff", urlByCdn, urlByContract);
  // looksSame(
  //   "punk01.png",
  //   "punk0001.png",
  //   { stopOnFirstFail: true, tolerance: 10 },
  //   function (error, { equal, ...others }) {
  //     console.log(3, equal, others);
  //   }
  // );
  // const urlByCdn = getImageUrlByCdn(
  //   CollectionsConfig[SupportedNFTCollections.CryptoPunks].address,
  //   1
  // );
  // const res = await axios(
  //   "https://imagedelivery.net/D-ZlL-vt2L5mseDrvcNiDg/0x981e2b9f4357b857db760f668a1794010a1c4196d106ec342c0e02ac405b39f7/w=24"
  // );
  // res.data;
  // const result = ethers.utils.sha256(ethers.utils.toUtf8String(res.data));
  // console.log(32, result);
};

run();
