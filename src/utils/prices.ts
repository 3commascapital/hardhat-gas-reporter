import axios from "axios";

import { DEFAULT_COINMARKET_BASE_URL, DEFAULT_BLOB_BASE_FEE } from "../constants";
import { GasReporterOptions } from "../types";
import {
  warnCMCRemoteCallFailed,
  warnGasPriceRemoteCallFailed,
  warnBaseFeeRemoteCallFailed,
  warnBlobBaseFeeRemoteCallFailed,
  warnUnsupportedChainConfig,
} from "./ui";
import { hexWeiToIntGwei } from "./gas";
import { getTokenForChain, getGasPriceUrlForChain, getBlockUrlForChain, getBlobBaseFeeUrlForChain } from "./chains";

/**
 * Fetches gas, base, & blob fee rates from etherscan as well as current market value of
 * network token in nation state currency specified by the options from coinmarketcap
 * (defaults to usd). Sets
 *
 * + options.tokenPrice
 * + options.gasPrice
 * + options.baseFee
 * + options.blobBaseFee
 *
 * ... unless these are already set as constants in the reporter options
 *
 * Returns a list of warnings generated if remote calls fail
 * @param  {GasReporterOptions} options
 */
export async function setGasAndPriceRates(options: GasReporterOptions): Promise<string[]> {
  if (
    (options.offline) ||
    !options.coinmarketcap ||
    (!options.L2 && options.tokenPrice && options.gasPrice) ||
    (options.L2 && options.tokenPrice && options.gasPrice && options.baseFee && options.blobBaseFee)
  ) return [];

  let block;
  let blockUrl;
  let gasPriceUrl;
  let blobBaseFeeUrl;
  const warnings: string[] = [];

  try {
    options.token = getTokenForChain(options);
    gasPriceUrl = getGasPriceUrlForChain(options);
    blockUrl = getBlockUrlForChain(options);
    blobBaseFeeUrl = getBlobBaseFeeUrlForChain(options);
  } catch (err: any){
    if (options.L2)
      warnings.push(warnUnsupportedChainConfig(options.L2!));
    else
      warnings.push(warnUnsupportedChainConfig(options.L1!));

    return warnings;
  }

  const axiosInstance = axios.create({
    baseURL: DEFAULT_COINMARKET_BASE_URL
  });

  const requestArgs = `latest?symbol=${options.token}&CMC_PRO_API_KEY=${
    options.coinmarketcap
  }&convert=`;

  const currencyKey = options.currency!.toUpperCase();
  const currencyPath = `${requestArgs}${currencyKey}`;

  // Currency market data: coinmarketcap
  if (!options.tokenPrice) {
    try {
      const response = await axiosInstance.get(currencyPath);
      options.tokenPrice = response.data.data[options.token].quote[
        currencyKey
      ].price.toFixed(2);
    } catch (error) {
      warnings.push(warnCMCRemoteCallFailed(error, DEFAULT_COINMARKET_BASE_URL + currencyPath));
    }
  }

  // Gas price data (Etherscan)
  if (!options.gasPrice) {
    try {
      const response = await axiosInstance.get(gasPriceUrl!);
      checkForEtherscanError(response.data.result);
      const gasPrice = hexWeiToIntGwei(response.data.result);
      options.gasPrice = (gasPrice >= 1 ) ? Math.round(gasPrice) : gasPrice;;
    } catch (error) {
      options.gasPrice = 0;
      warnings.push(warnGasPriceRemoteCallFailed(error, gasPriceUrl!));
    }
  }

  // baseFee data (Etherscan)
  if (options.L2 && !options.baseFee) {
    try {
      block = await axiosInstance.get(blockUrl);
      checkForEtherscanError(block.data.result);
      options.baseFee = Math.round(hexWeiToIntGwei(block.data.result.baseFeePerGas))
    } catch (error) {
      options.baseFee = 0;
      warnings.push(warnBaseFeeRemoteCallFailed(error, blockUrl));
    }
  }

  // blobBaseFee data: etherscan eth_call to OP Stack gas oracle on L2
  if (
    (options.L2 === "optimism" || options.L2 === "base") &&
    options.optimismHardfork === "ecotone" &&
    !options.blobBaseFee
  ) {
    try {
      const blobBaseFee = await axiosInstance.get(blobBaseFeeUrl);
      checkForEtherscanError(blobBaseFee.data.result);
      options.blobBaseFee = Math.round(hexWeiToIntGwei(blobBaseFee.data.result))
    } catch (error) {
      options.blobBaseFee = DEFAULT_BLOB_BASE_FEE;
      warnings.push(warnBlobBaseFeeRemoteCallFailed(error));
    }
  }

  return warnings;
}

function checkForEtherscanError(res: string) {
  if (typeof res === "string" && !res.includes("0x")){
    throw new Error(res);
  }
}
