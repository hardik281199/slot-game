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
     * @param {static} static static data  
     * @returns viewZone And Mattix OfReel
     */
    generateViewZone=(sta)=>{
        const arrayOfReel =sta.arrayOfReel;
        const row =sta.viewZone.rows;
        const colume = sta.viewZone.columns;           
        const randomNumber = this.randomInt(0,9);
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
            let symbolArray = [];
            let wildCounter = 0;
            for(let col = 0; col< row; col++) {
                const symbol = this.getSymbol(randomNumber,arrayOfReel[reel],arrayOfReel[reel].length, reel, col);
                symbolArray.push(symbol);
                if(symbol === 'WILD'){
                    wildCounter++;
                }
            }
            if(wildCounter > 1){
                let newSymbolArray = this.countOfWild(arrayOfReel[reel],arrayOfReel[reel].length, reel ,row);
                viewZone[`reel${reel}`].push(...newSymbolArray);
            }else{
                viewZone[`reel${reel}`].push(...symbolArray);
            }
            generatedArray.push(viewZone[`reel${reel}`]);
        }
        return {"generatedArray" : generatedArray,"viewZone" :  viewZone}
    }
    
    /**
     * this function use where in reel 2 wild card come then replace other symbole
     * @param {arrayOfReel} arrayOfReel arrayOfReel reel config
     * @param {length} length length og arrayOfReel
     * @param {reel} reel reel number
     * @param {row} row row of viewZone
     * @returns 
     */
    countOfWild(arrayOfReel,length,reel,row){
        const randomNumber = this.randomInt(0,9);
        let wildCounter = 0;
        let symbolArray = [];
        for(let col = 0; col< row; col++) {
            const symbol = this.getSymbol(randomNumber,arrayOfReel,length, reel, col);
            symbolArray.push(symbol);
            if(symbol === 'WILD'){
                wildCounter++;
            }
        }
        if(wildCounter > 1){
            this.countOfWild(arrayOfReel,length,reel),row;
        }
            
        return symbolArray;
        
    }

    /**
     * this function check wild card and convert reel symbol in wild card 
     * @param {ViewZone} generateViewZone generate ViewZone
     * @returns viewZone , generatedArray , expandingWild
    */
    expandingWildCard = (generateViewZone) =>{
        const viewZone = {
            reel0: [],
            reel1: [],
            reel2: [],
            reel3: [],
            reel4: []
        };
        const newGenerateArray =[];
        const expandingWild = [];
        for(let reel = 0; reel < generateViewZone.generatedArray.length; reel++){
            const celement = generateViewZone.generatedArray[reel];
            const element = JSON.parse(JSON.stringify(celement));
            const found = element.find(symbol => symbol === 'WILD');
            if (found === 'WILD') {
                viewZone[`reel${reel}`].push(element.fill('WILD'));
                newGenerateArray.push(element.fill('WILD'));
                let col = 0
                for (col; col < generateViewZone.generatedArray[reel].length; col++) {
                    if (generateViewZone.generatedArray[reel][col] === 'WILD') {
                        break ;
                    }
                }
                expandingWild.push({
                    "column": reel,
                    "row": col
                })
            }else{
                viewZone[`reel${reel}`].push(element);
                newGenerateArray.push(element);
            }
               
        }
        return {viewZone : viewZone ,generatedArray : newGenerateArray , expandingWild : expandingWild }  
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

    /**
     * check payline in matrix
     * @param {payarray} payarray array of kind of symbole pay
     * @param {matrix} matrixReelXCol marix of reel
     * @param {content} content database data
     * @param {pay} Pay paytable 
     * @returns 
     */
    checkPayline=(payarray,matrixReelXCol,content,Pay) =>{
        let sactterCount = 0; 
        const result =[];
        let wallet = content.wallet;
        let winAmount = 0 ;
        let WinFreeSpinAmount = content.WinFreeSpinAmount;
        let freeSpin = content.freeSpin;
        let totalfreeSpin = content.totalfreeSpin;
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
                    let SymbolOfResult = this.buildPayLine(count,symbol,Pay,payline,content.betAmount,freeSpin,WinFreeSpinAmount);
                    result.push({symbol: SymbolOfResult.symbol,wintype: SymbolOfResult.wintype,Payline: SymbolOfResult.Payline,WinAmount: SymbolOfResult.WinAmount});
                    winAmount += SymbolOfResult.WinAmount;
                    WinFreeSpinAmount = SymbolOfResult.WinFreeSpinAmount;
                }
                let checkScatter= matrixReelXCol[rowOfMatrix][rowOfPayArray];
                //checkScatter
                if (checkScatter === 'SCATTER' ){
                    sactterCount++;
                }
            }
        }
        wallet = winAmount + wallet;
        if (sactterCount > 2){
            if (freeSpin === 0) {
                freeSpin =5 ;
                totalfreeSpin = freeSpin;
            }
            
        }
        return {sactterCount :sactterCount,result : result ,wallet : wallet ,WinFreeSpinAmount : WinFreeSpinAmount, freeSpin : freeSpin, totalfreeSpin : totalfreeSpin }
    }

    /**
     * count same symbol in matrix
     * @param {matrixOf reel} matrixReelXCol  REEL X COLUM matrix 
     * @param {payline} payline parray of line
     * @param {row} rowOfMatrix matrixReelXCol row
     * @returns count and symbol
     */
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

    /**
     * calculation of match payline and return json data
     * @param {count} count count of same symbol
     * @param {symbol} symbol symbol
     * @param {content} content dataBase data
     * @param {Pay} Pay paytable
     * @param {payline} payline payarray of line 
     * @returns {symbol,wintype,payline,winamount,wallet,WinFreeSpinAmount}
     */
    buildPayLine = (count,symbol,Pay,payline,betAmount,freeSpin,WinFreeSpinAmount) =>{
        let multipler = Pay[`${symbol}`][`${count}ofakind`];
        if(freeSpin > 0){
            WinFreeSpinAmount =this.creditWinAmount(multipler,betAmount,WinFreeSpinAmount);
        }
        return {symbol,wintype: `${count}ofakind`,Payline : payline ,WinAmount : betAmount * multipler, WinFreeSpinAmount : WinFreeSpinAmount }
    }

    countOfFreeSpin = (freeSpin,totalfreeSpin) =>{
        if(freeSpin > 0){
            totalfreeSpin += 3 ;
            freeSpin += 3; 
        }else{
            freeSpin =5 ;
            totalfreeSpin = freeSpin;
        }      
        return {freeSpin : freeSpin , totalfreeSpin : totalfreeSpin }
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