import { ethers } from "ethers";

export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export const IMAGE_DIRNAME = "collections";
export const LOG_FILENAME = "main.log";

export const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/fb72a26ed5ac44b1b67646db5621e85d"
);

export enum SupportedNFTCollections {
  Bayc = "BAYC",
  CryptoPunks = "WPUNKS",
  Mayc = "MAYC",
  Doodles = "DOODLES",
}

export type SupportedNFTCollectionItem = {
  address: string;
  tokenName: string;
  nftType: "erc721" | "punks";
  indexFrom: number;
};

export const CollectionsConfig: Record<
  SupportedNFTCollections,
  SupportedNFTCollectionItem
> = {
  [SupportedNFTCollections.Bayc]: {
    address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenName: "BAYC",
    indexFrom: 0,
    nftType: "erc721",
  },
  [SupportedNFTCollections.CryptoPunks]: {
    address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    tokenName: "WPUNKS",
    indexFrom: 0,
    nftType: "punks",
  },
  [SupportedNFTCollections.Mayc]: {
    address: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
    tokenName: "MAYC",
    indexFrom: 1,
    nftType: "erc721",
  },
  [SupportedNFTCollections.Doodles]: {
    address: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    tokenName: "DOODLES",
    indexFrom: 0,
    nftType: "erc721",
  },
};
