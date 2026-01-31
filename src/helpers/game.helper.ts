import constants from '../config/constants';
const { card } = constants;

interface GenerateViewZoneResult {
  generatedArray: string[][];
  viewZone: Record<string, string[]>;
}

interface ExpandingWildResult {
  viewZone: Record<string, string[]>;
  generatedArray: string[][];
  expandingWild: { column: number; row: number }[];
  wildMultipliar: number;
  wildMultipliarArray: { row: number; column: number; multiplier: number }[];
  checkDevil: number[];
}

interface PaylineResult {
  sactterCount: number;
  result: { symbol: string; wintype: string; Payline: number[]; WinAmount: number }[];
  wallet: number;
  WinFreeSpinAmount: number;
  freeSpin: number;
  totalfreeSpin: number;
  winAmount: number;
}

export class GameHelper {
  randomInt = (low: number, high: number): number => {
    return Math.floor(Math.random() * (high - low + 1) + low);
  };

  getSymbol = (
    randomArr: number[],
    arrayOfReel: string[],
    reelLength: number,
    reel: number,
    col: number
  ): string => {
    const idx = (randomArr[reel] + col) % reelLength;
    return arrayOfReel[idx];
  };

  generateViewZone = (sta: { arrayOfReel: string[][]; viewZone: { rows: number; columns: number } }): GenerateViewZoneResult => {
    const arrayOfReel = sta.arrayOfReel;
    const row = sta.viewZone.rows;
    const colume = sta.viewZone.columns;
    const randomNumber: number[] = [];
    for (let index = 0; index < colume; index++) {
      randomNumber.push(this.randomInt(0, arrayOfReel[index].length));
    }
    const viewZone: Record<string, string[]> = {
      reel0: [], reel1: [], reel2: [], reel3: [], reel4: [],
    };
    const generatedArray: string[][] = [];
    for (let reel = 0; reel < colume; reel++) {
      const symbolArray: string[] = [];
      let wildCounter = 0;
      for (let col = 0; col < row; col++) {
        const symbol = this.getSymbol(randomNumber, arrayOfReel[reel], arrayOfReel[reel].length, reel, col);
        symbolArray.push(symbol);
        if (symbol === 'WILD') wildCounter++;
      }
      if (wildCounter > 1) {
        const newSymbolArray = this.countOfWild(arrayOfReel[reel], arrayOfReel[reel].length, reel, row);
        viewZone[`reel${reel}`].push(...newSymbolArray);
      } else {
        viewZone[`reel${reel}`].push(...symbolArray);
      }
      generatedArray.push(viewZone[`reel${reel}`]);
    }
    return { generatedArray, viewZone };
  };

  countOfWild(
    arrayOfReel: string[],
    length: number,
    reel: number,
    row: number
  ): string[] {
    const randomNumber = [this.randomInt(0, length - 1)];
    let wildCounter = 0;
    const symbolArray: string[] = [];
    for (let col = 0; col < row; col++) {
      const symbol = this.getSymbol(randomNumber, arrayOfReel, length, 0, col);
      symbolArray.push(symbol);
      if (symbol === 'WILD') wildCounter++;
    }
    if (wildCounter > 1) {
      return this.countOfWild(arrayOfReel, length, reel, row);
    }
    return symbolArray;
  }

  expandingWildCard = (
    generateViewZone: GenerateViewZoneResult,
    wildMultiArray: number[]
  ): ExpandingWildResult => {
    const viewZone: Record<string, string[]> = {
      reel0: [], reel1: [], reel2: [], reel3: [], reel4: [],
    };
    const wildMultipliarArray: { row: number; column: number; multiplier: number }[] = [];
    let wildMultipliar = 0;
    const checkDevil: number[] = [];
    const newGenerateArray: string[][] = [];
    const expandingWild: { column: number; row: number }[] = [];
    for (let reel = 0; reel < generateViewZone.generatedArray.length; reel++) {
      for (let col = 0; col < generateViewZone.generatedArray[reel].length; col++) {
        const check = generateViewZone.generatedArray[reel][col];
        if (check === 'WILD') {
          const random = this.randomWildMul(wildMultiArray);
          wildMultipliar += random;
          wildMultipliarArray.push(this.wildMult(reel, col, random));
        }
        if (check === 'DEVIL') checkDevil.push(col);
      }
      const celement = generateViewZone.generatedArray[reel];
      const element = JSON.parse(JSON.stringify(celement)) as string[];
      const found = element.find((symbol) => symbol === 'WILD');
      if (found === 'WILD') {
        viewZone[`reel${reel}`].push(...element.fill('WILD'));
        newGenerateArray.push(element.fill('WILD'));
        let col = 0;
        for (; col < generateViewZone.generatedArray[reel].length; col++) {
          if (generateViewZone.generatedArray[reel][col] === 'WILD') break;
        }
        expandingWild.push({ column: reel, row: col });
      } else {
        viewZone[`reel${reel}`].push(...element);
        newGenerateArray.push(element);
      }
    }
    return {
      viewZone,
      generatedArray: newGenerateArray,
      expandingWild,
      wildMultipliar,
      wildMultipliarArray,
      checkDevil,
    };
  };

  wildMult = (reel: number, row: number, random: number): { row: number; column: number; multiplier: number } => ({
    row,
    column: reel,
    multiplier: random,
  });

  matrix = (
    generateViewZone: ExpandingWildResult,
    row: number,
    colume: number
  ): string[][] => {
    const matrixReelXCol: string[][] = [];
    for (let matrixCol = 0; matrixCol < row; matrixCol++) {
      const arrar: string[] = [];
      for (let matrixRow = 0; matrixRow < colume; matrixRow++) {
        arrar[matrixRow] = generateViewZone.generatedArray[matrixRow][matrixCol];
      }
      matrixReelXCol.push(arrar);
    }
    return matrixReelXCol;
  };

  checkPayline = (
    payarray: number[][],
    matrixReelXCol: string[][],
    content: Record<string, unknown>,
    pay: Record<string, Record<string, number>>,
    checkDevil: number[]
  ): PaylineResult => {
    let sactterCount = 0;
    const result: { symbol: string; wintype: string; Payline: number[]; WinAmount: number }[] = [];
    let wallet = content.wallet as number;
    let winAmount = 0;
    let WinFreeSpinAmount = (content.WinFreeSpinAmount as number) ?? 0;
    let freeSpin = (content.freeSpin as number) ?? 0;
    let totalfreeSpin = (content.totalfreeSpin as number) ?? 0;
    for (let rowOfMatrix = 0; rowOfMatrix < matrixReelXCol.length; rowOfMatrix++) {
      for (let rowOfPayArray = 0; rowOfPayArray < payarray.length; rowOfPayArray++) {
        const payline = payarray[rowOfPayArray];
        const unique = [...new Set(checkDevil)];
        const found = unique.find((symbol) => symbol === payline[rowOfPayArray]);
        if (found !== payline[rowOfPayArray]) {
          const countOfSym = this.countOfSymbol(matrixReelXCol, payline, rowOfMatrix);
          const count = countOfSym.count;
          const symbol = countOfSym.symbol;
          if (count > 2) {
            if (symbol === 'WILD') break;
            const SymbolOfResult = this.buildPayLine(
              count,
              symbol,
              pay,
              payline,
              content.betAmount as number,
              freeSpin,
              WinFreeSpinAmount
            );
            result.push({
              symbol: SymbolOfResult.symbol,
              wintype: SymbolOfResult.wintype,
              Payline: SymbolOfResult.payline,
              WinAmount: SymbolOfResult.WinAmount,
            });
            winAmount += SymbolOfResult.WinAmount;
            WinFreeSpinAmount = SymbolOfResult.WinFreeSpinAmount;
          }
        }
        const check = matrixReelXCol[rowOfMatrix][rowOfPayArray];
        if (check === 'SCATTER') sactterCount++;
      }
    }
    if (sactterCount > 2) {
      const countOfFreeSpin = this.countOfFreeSpin(freeSpin, totalfreeSpin);
      freeSpin = countOfFreeSpin.freeSpin;
      totalfreeSpin = countOfFreeSpin.totalfreeSpin;
    }
    return { sactterCount, result, wallet, WinFreeSpinAmount, freeSpin, totalfreeSpin, winAmount };
  };

  countOfSymbol = (
    matrixReelXCol: string[][],
    payline: number[],
    rowOfMatrix: number
  ): { count: number; symbol: string } => {
    let count = 0;
    const symbol = matrixReelXCol[rowOfMatrix][0];
    if (payline[0] === rowOfMatrix && symbol !== 'DEVIL') {
      count++;
      for (let element = 1; element < payline.length; element++) {
        if (symbol === 'WILD' && matrixReelXCol[payline[element]][element] !== 'DEVIL') {
          count++;
          continue;
        }
        if (
          matrixReelXCol[payline[element]][element] !== 'WILD' &&
          matrixReelXCol[payline[element]][element] !== symbol
        ) {
          break;
        }
        count++;
      }
    }
    return { count, symbol: symbol ?? '' };
  };

  randomWildMul = (wildMult: number[]): number => {
    return wildMult[Math.floor(Math.random() * wildMult.length)];
  };

  buildPayLine = (
    count: number,
    symbol: string,
    pay: Record<string, Record<string, number>>,
    payline: number[],
    betAmount: number,
    freeSpin: number,
    WinFreeSpinAmount: number
  ): {
    symbol: string;
    wintype: string;
    payline: number[];
    WinAmount: number;
    WinFreeSpinAmount: number;
  } => {
    const paySymbol = pay[symbol as string];
    const multipler = (paySymbol && paySymbol[`${count}ofakind`]) ?? 0;
    if (freeSpin > 0) {
      WinFreeSpinAmount = this.creditWinAmount(multipler, betAmount, WinFreeSpinAmount);
    }
    return {
      symbol,
      wintype: `${count}ofakind`,
      payline,
      WinAmount: betAmount * multipler,
      WinFreeSpinAmount,
    };
  };

  countOfFreeSpin = (freeSpin: number, totalfreeSpin: number): { freeSpin: number; totalfreeSpin: number } => {
    if (freeSpin > 0) {
      totalfreeSpin += 3;
      freeSpin += 3;
    } else {
      freeSpin = 5;
      totalfreeSpin = freeSpin;
    }
    return { freeSpin, totalfreeSpin };
  };

  freeSpin = (
    freeSpin: number,
    WinFreeSpinAmount: number,
    totalfreeSpin: number
  ): { numberOfFreespins: number; remainingSpins: number; freeSpinTriggered: string; WinAmount: number } => ({
    numberOfFreespins: totalfreeSpin,
    remainingSpins: freeSpin,
    freeSpinTriggered: freeSpin === totalfreeSpin ? 'true' : 'false',
    WinAmount: WinFreeSpinAmount,
  });

  debitWinAmount = (wallet: number, betAmount: number): number => {
    return wallet - betAmount;
  };

  creditWinAmount = (multipler: number, betAmount: number, WinFreeSpinAmount: number): number => {
    return WinFreeSpinAmount + betAmount * multipler;
  };

  randomGambleCard = (gambleCard: string[]): string => {
    return gambleCard[Math.floor(Math.random() * gambleCard.length)];
  };

  conutGamble = (
    req: import('express').Request,
    result: { content: Record<string, unknown> },
    _gameVariable: { content: Record<string, unknown> }
  ): { gambleWin: number; winInSpin: number; gamblecounter: number; gambleHistory: string[] } => {
    let { winInSpin, gamblecounter, gambleWin, gambleHistory } = result.content as {
      winInSpin: number;
      gamblecounter: number;
      gambleWin: number;
      gambleHistory: string[];
    };
    if (!gambleHistory) gambleHistory = [];
    const gambleCard = this.randomGambleCard(card);
    if (req.body.card === gambleCard) {
      gamblecounter += 1;
      gambleWin = winInSpin;
      winInSpin = winInSpin * 2;
      gambleHistory.push(gambleCard);
    } else {
      gamblecounter = 0;
      gambleWin = 0;
      gambleHistory = [];
      winInSpin = 0;
    }
    return { gambleWin, winInSpin, gamblecounter, gambleHistory };
  };

  collectWallet = (result: {
    content: Record<string, unknown>;
  }): {
    wallet: number;
    winInSpin: number;
    gamblecounter: number;
    gambleWin: number;
    wildMultipliar: number;
  } => {
    let { wallet, winInSpin, gamblecounter, gambleWin, wildMultipliar } = result.content as {
      wallet: number;
      winInSpin: number;
      gamblecounter: number;
      gambleWin: number;
      wildMultipliar: number;
    };
    wallet = wallet + winInSpin * wildMultipliar;
    if (gambleWin > 0) {
      gamblecounter = 0;
      gambleWin = 0;
    }
    winInSpin = 0;
    wildMultipliar = 0;
    return { wallet, winInSpin, gamblecounter, gambleWin, wildMultipliar };
  };
}

export const gameHelper = new GameHelper();
