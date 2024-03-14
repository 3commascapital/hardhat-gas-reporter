import chalk from "chalk";
import { EOL } from "os";

import {
  DEFAULT_GAS_PRICE_PRECISION,
  TABLE_NAME_LEGACY,
  TABLE_NAME_MARKDOWN,
  TABLE_NAME_TERMINAL
} from "../constants";
import { GasReporterOptions } from "../types";

const log = console.log;

export function indentText(val: string) {
  return `    ${val}`;
}

export function indentMarkdown(val: string) {
  return `       *${val}*`;
}

export function indentTextWithSymbol(val: string, symbol: string) {
  return ` ${symbol}  ${val}`;
}

export function indentMarkdownWithSymbol(val: string, symbol: string) {
  return `    ${symbol}  *${val}*`;
}

export function entitleMarkdown(val: string) {
  return `**${val}**`;
}

export function markdownBold(val: string) {
  return `**${val}**`;
}

export function markdownItalic(val: string) {
  return `*${val}*`
}

export function getSmallestPrecisionVal(precision: number): number {
  let start = "."
  for (let i = 0; i < precision - 1; i++ ) {
    start += "0";
  }
  start += "1";
  return parseFloat(start);
}

export function costIsBelowPrecision(_cost: string, options: GasReporterOptions): boolean {
  const cost = parseFloat(_cost);

  if (isNaN(cost)) return false;

  return cost < getSmallestPrecisionVal(options.currencyDisplayPrecision!)
}

const startWarning = chalk.yellow.bold(`>>>>> WARNING (hardhat-gas-reporter plugin) <<<<<<`)

function remoteCallEndMessage(err: any) : string {
  return `${
  chalk.bold(`Error was: `)
  }${chalk.red (err.message)                                                              }${EOL
  }${chalk.bold(`Reported price data is missing or incorrect`)                            }${EOL
  }${chalk.blue(`* Being rate limited? See the "Etherscan" section in the docs.`)         }${EOL
  }${chalk.blue(`* Set the "offline" option to "true" to suppress these warnings`)        }${EOL
  }${chalk.yellow.bold(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)              }${EOL}`;
};

export function warnCMCRemoteCallFailed(err: any, url: string): string {
  return `${
  startWarning                                                                          }${EOL
  }${chalk.bold(`Failed to get token price from ${url}`)                                }${EOL
  }${remoteCallEndMessage(err)}`;
}

export function warnGasPriceRemoteCallFailed(err: any, url: string): string {
  return `${
  startWarning                                                                          }${EOL
  }${chalk.bold(`Failed to get gas price from ${url}`)                                  }${EOL
  }${remoteCallEndMessage(err)}`;
}

export function warnBaseFeeRemoteCallFailed(err: any, url: string): string {
  return `${
  startWarning                                                                          }${EOL
  }${chalk.bold(`Failed to get L1 base fee from ${url}`)                                }${EOL
  }${remoteCallEndMessage(err)}`;
}

export function warnBlobBaseFeeRemoteCallFailed(err: any, url: string): string {
  return `${
  startWarning                                                                          }${EOL
  }${chalk.bold(`Failed to get L1 blob base fee from ${url}`)                           }${EOL
  }${remoteCallEndMessage(err)}`;
}

export function warnUnsupportedChainConfig(chain: string): string {
  return `${
    startWarning                                                                          }${EOL
    }${chalk.bold(
      `Unsupported "L1" or "L2" setting: "${chain}" encountered while configuring ` +
      `price data urls. Please set the necessary override options yourself ` +
      `or use one of the supported auto-config L1 or L2 values (see docs).`
    )                                                                                     }${EOL
    }${remoteCallEndMessage({message: ""})}`;
}

/**
 * Message for un-parseable ABI (ethers)
 * @param  {string} name contract name
 * @param  {any} err
 * @return {void}
 */
export function warnEthers(name: string, err: any) {
  const msg = `${
    startWarning                                                                                 }${EOL
    }${chalk.bold(
      `Failed to parse ABI for contract: "${name}". (Its method data will not be collected).`
    )                                                                                            }${EOL
    }Please report the error below with the source that caused it to ` +
    `github.com/cgewecke/hardhat-gas-reporter${                                                   EOL
    }${chalk.yellow(`>>>>>>>>>>>>>>>>>>>>`)}${EOL}${
    chalk.red(`${err}`)}`;

    log(msg);
}

/**
 * Message invalid report formats
 * @param  {string} name report format
 * @return {void}
 */
export function warnReportFormat(name: string | undefined) {
  const msg = `${
    startWarning                                                                                 }${EOL
    }${chalk.bold(
      `Failed to generate gas report for format: "${name!}". The available formats are: `
    )                                                                                            }${EOL
    }${chalk.green(`> "${TABLE_NAME_TERMINAL}"`)                                                    }${EOL
    }${chalk.green(`> "${TABLE_NAME_MARKDOWN}"`)                                                    }${EOL
    }${chalk.green(`> "${TABLE_NAME_LEGACY}"`)                                                      }${EOL
    }${chalk.yellow(`>>>>>>>>>>>>>>>>>>>>`)                                                            }${EOL}`;

    log(msg);
}

/**
 * Message for `--parallel` disabling gas reporter
 * @return {void}
 */
export function warnParallel() {
  const msg = `${
    startWarning                                                                                 }${EOL
    }${chalk.bold(
      "Gas reporting has been skipped because plugin `hardhat-gas-reporter` " +
     "does not support the --parallel flag."
    )                                                                                            }${EOL
    }${chalk.yellow(`>>>>>>>>>>>>>>>>>>>>`)                                                         }${EOL}`;

  log(msg);
}

/**
 * Message for deprecated task names
 * @return {void}
 */
export function warnDeprecatedTask(newName: string) {
  const msg = `${
    startWarning                                                                                 }${EOL
    }${chalk.bold(
      `This gas reporter task has been renamed to "${chalk.green(newName)}"`
    )                                                                                            }${EOL
    }${chalk.yellow(`>>>>>>>>>>>>>>>>>>>>`)                                                         }${EOL}`;

  log(msg);
}

export function reportMerge(files: string[], output: string) {
  let filesList = "";
  files.forEach(
    (f: string) => filesList += chalk.yellow(`  - ${f}`) + EOL
  );

  const msg = `${
    chalk.bold(`Merging ${files.length} input files:`)  }${EOL
    }${filesList  }${EOL
    }${chalk.bold("Output: ")  }${  EOL
    }  - ${chalk.green(output)  }${EOL}`;

  log(msg);
}

/**
 * Gets L1 / L2 variables shared between tables
 * @param options
 * @returns
 */
export function getCommonTableVals(options: GasReporterOptions) {
  const usingL1 = options.L2 === undefined;

  let token = "";
  let l1gwei: string | number = (usingL1) ? options.gasPrice!: options.baseFee!;
  let l2gwei: string | number = (usingL1) ? "" : options.gasPrice!;
  const l1gweiNote: string = (usingL1) ? "" : "(baseFee)";
  const l2gweiNote: string = (usingL1) ? "" : "(gasPrice)";
  const network = (usingL1) ? options.L1!.toUpperCase() : options.L2!.toUpperCase();

  const rate = (options.tokenPrice)
    ? parseFloat(options.tokenPrice.toString()).toFixed(2)
    : "-";

  const currency = (options.currency)
    ? `${options.currency!.toLowerCase()}`
    : "-";

  if (options.token) {
    token = `${options.token.toLowerCase()}`;
  }

  // Truncate subzero gas prices to 5 decimal precision
  if (typeof l1gwei === "number" && l1gwei < 1) {
    l1gwei = parseFloat(l1gwei.toString()).toFixed(DEFAULT_GAS_PRICE_PRECISION);
  }

  if (typeof l2gwei === "number" && l2gwei < 1) {
    l2gwei = parseFloat(l2gwei.toString()).toFixed(DEFAULT_GAS_PRICE_PRECISION);
  }

  const nonZeroMsg = "Cost was non-zero but below the precision setting for the currency display (see options)";
  const intrinsicMsg = "Execution gas for this method does not include intrinsic gas overhead ";

  return {
    l1gwei,
    l2gwei,
    l1gweiNote,
    l2gweiNote,
    network,
    rate,
    currency,
    token,
    nonZeroMsg,
    intrinsicMsg
  }
}