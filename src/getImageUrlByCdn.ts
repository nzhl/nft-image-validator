import { ethers } from "ethers";

const getImageUrlByCdn = (address: string, tokenId: number) => {
  const raw = `evm_1_${address}_${tokenId}`;
  const hash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`parallel\n${raw}`)
  );
  return `https://imagedelivery.net/D-ZlL-vt2L5mseDrvcNiDg/${hash}`;
};

export default getImageUrlByCdn;
