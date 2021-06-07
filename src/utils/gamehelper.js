class GameHelper{

    /**
     * It generates an array of random numbers
     * these random numbers will be used to generate viewzone
     * @param {low}  first index of reel config
     * @param {high} last index of reel config
     * @returns ArrayOfNumbers Ex :[1,2,3,4,5]
     */
     randomInt = (low, high) =>{ 
        let numOfArry = [];
        for (let i = 0; i < 5; i++) {
            const element = Math.floor(Math.random() * (high - low + 1) + low);
            numOfArry.push(element);            
        }
        return numOfArry
    }
    
    /**
     * It returns particular symbol at requested reel & column index from reel configuration
     * @param {randomArr} randomArr random array
     * @param {reelLength} reelLength length of random array
     * @param {reel} reel number of reel
     * @param {col} col number of col
     * @returns symbole of array ex :[h1+1,h2+1,h3+3,h4+4,h5+5]
     */
    getSymbol = (randomArr,arrayOfReel ,reelLength, reel, col) =>{
        let symbol = arrayOfReel[(randomArr[reel] + col) % reelLength];
        return symbol;
    }

    /**
     * generate ViewZone
     * @param {randomNumber} randomNumber array of randomNumber 
     * @param {static} static static data  
     * @returns viewZone And Mattix OfReel
     */
    generateViewZone=(randomNumber,sta)=>{
        const arrayOfReel =sta.arrayOfReel;
        const row =sta.viewZone.rows;
        const colume = sta.viewZone.columns
        /**
         * prepared json reel of viewZone
         */
        const viewZone = {
            reel0: [],
            reel1: [],
            reel2: [],
            reel3: [],
            reel4: []
        };        
        let generatedArray = [];
        //create view zone
        for(let reel = 0;reel < colume;reel++){
            for(let col = 0; col< row; col++) {
                const symbol = this.getSymbol(randomNumber,arrayOfReel[reel],arrayOfReel[reel].length, reel, col);
                viewZone[`reel${reel}`].push(symbol);
            }
            generatedArray.push(viewZone[`reel${reel}`])
        }
        return {"generatedArray" : generatedArray,"viewZone" :  viewZone}
    }

    /**
     * reel change in matrix
     * @param {row} row row of matrix
     * @param {colume} colume colume of matrix
     * @returns matrix REEL X COLUME
     */
    matrix = (generateViewZone,row,colume) => {
        let matrixReelXCol = [];
        for (let matrixCol = 0; matrixCol < row; matrixCol++) {
            let arrar = [];           
            for (let matrixRow = 0; matrixRow < colume; matrixRow++) {
                let num = generateViewZone.generatedArray[matrixRow][matrixCol];
                arrar[matrixRow] = num;
            }            
            matrixReelXCol.push(arrar);                      
        }
        return matrixReelXCol; 
    }

    checkPayline=(payarray,matrixReelXCol,content,Pay) =>{
        let sactterCount = 0; 
        const result =[];
        let wallet = 0;
        let WinFreeSpinAmount = 0
        for (let rowOfMatrix = 0; rowOfMatrix < matrixReelXCol.length; rowOfMatrix++) {
            for (let rowOfPayArray = 0; rowOfPayArray < payarray.length; rowOfPayArray++) { 
                             
                let payline = payarray[rowOfPayArray];
                let countOfSym = this.countOfSymbol(matrixReelXCol,payline,rowOfMatrix);
                let count = countOfSym.count;
                let symbol = countOfSym.symbol;
                if (count > 2){
                    if (symbol === 'WILD'){
                        break ;
                    }
                    const SymbolOfResult = this.buildPayLine(count,symbol,content,Pay,payline);
                    wallet = SymbolOfResult.wallet;
                    WinFreeSpinAmount = SymbolOfResult.WinFreeSpinAmount;
                    result.push({symbol: SymbolOfResult.symbol,
                        wintype: SymbolOfResult.wintype,
                        Payline: SymbolOfResult.Payline,
                        WinAmount: SymbolOfResult.WinAmount})
                }
                let checkScatter= matrixReelXCol[rowOfMatrix][rowOfPayArray];
                //checkScatter
                if (checkScatter === 'SCATTER' ){
                    sactterCount++;
                }
            }
        }
        return {sactterCount :sactterCount,result : result ,wallet : wallet ,WinFreeSpinAmount : WinFreeSpinAmount}
    }

    countOfSymbol = (matrixReelXCol,payline,rowOfMatrix) => {
        let count = 0;
        let d = 0;
        let symbol = matrixReelXCol[rowOfMatrix][d];
                
        if(payline[0] === rowOfMatrix && symbol !== 'SCATTER'){
            count++;
            for (let element = 1; element < payline.length; element++) {
                if (symbol === 'WILD' && matrixReelXCol[payline[element]][element] !== 'SCATTER'){
                    symbol = matrixReelXCol[payline[element]][element];
                    count++;
                    continue;
                }
                if (matrixReelXCol[payline[element]][element] != 'WILD' && matrixReelXCol[payline[element]][element] != symbol){
                    break;
                }
                count++;
            }
            
            
        }
        return {count :count,symbol : symbol};
    }


    buildPayLine = (count,symbol,content,Pay,payline) =>{
        let wallet = content.wallet;
        console.log(content.wallet + "   this is wallet");
        let freeSpin = content.freeSpin;
        let WinFreeSpinAmount = content.WinFreeSpinAmount;
        let betAmount = content.betAmount;

        let multipler = Pay[`${symbol}`][`${count}ofakind`];
        if(freeSpin > 0){
            WinFreeSpinAmount =this.creditWinAmount(multipler,betAmount,WinFreeSpinAmount);
        }
        wallet += betAmount * multipler;
        return {symbol,wintype: `${count}ofakind`,Payline : payline ,WinAmount : betAmount * multipler, WinFreeSpinAmount : WinFreeSpinAmount , wallet : wallet }
    }

    

    /**
     * set response freeSpin
     * @returns free spin details [numberOfFreespins, currentFreeSpin, freeSpinTriggered] 
     */
    freeSpin = (freeSpin , WinFreeSpinAmount , totalfreeSpin ) => {
        let scatterOffreeSpin = {
            numberOfFreespins: totalfreeSpin,
            remainingSpins: freeSpin,
            freeSpinTriggered: freeSpin > 0 ? 'true' : 'false',
            WinAmount : WinFreeSpinAmount
        }
        
        return scatterOffreeSpin;  
    }

    /**
     * whenever free spin not occurred 
     * @returns wallet 
     */
    debitWinAmount = (wallet,betAmount) => {
         wallet -= betAmount ;
        return wallet
    }

    /**
     * whenever free spin occurred 
     * @param {multipler} multipler total win amount
     * @returns in free spin count total win amount
     */
    creditWinAmount = (multipler,betAmount , WinFreeSpinAmount) => {
        WinFreeSpinAmount += betAmount * multipler;

        return WinFreeSpinAmount;
    }
}

const gameFunction = new GameHelper();
module.exports.gameHelper= gameFunction