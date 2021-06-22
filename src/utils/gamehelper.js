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
     * this view zone use in counting win
     * @param {static} static static data  
     * @returns viewZone And Mattix OfReel
     */
    generateViewZone=(sta)=>{
        const arrayOfReel =sta.arrayOfReel;
        const row =sta.viewZone.rows;
        const colume = sta.viewZone.columns;           
        const randomNumber = this.randomInt(0,10);
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
     * this function check wild card and convert reel symbol in wild card.
     * this function check devil card in viewzone 
     * @param {ViewZone} generateViewZone generate ViewZone
     * @returns viewZone , generatedArray , expandingWild , devil Check
    */
    expandingWildCard = (generateViewZone,wildMultiArray) =>{
        const viewZone = {
            reel0: [],
            reel1: [],
            reel2: [],
            reel3: [],
            reel4: []
        };
        let wildMultipliarArray = [];
        let wildMultipliar = 0;
        let checkDevil = [];
        const newGenerateArray =[];
        const expandingWild = [];
        for(let reel = 0; reel < generateViewZone.generatedArray.length; reel++){
            for (let col = 0; col < generateViewZone.generatedArray[reel].length; col++) {
                let check = generateViewZone.generatedArray[reel][col];
                if(check === 'WILD'){
                    let random = this.randomWildMul(wildMultiArray);
                    wildMultipliar += random;
                    let wildResponse = this.wildMult(reel,col,random);
                    wildMultipliarArray.push(wildResponse);
                }if(check === 'DEVIL'){
                    checkDevil.push(col);
                }
            }
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
        return {viewZone ,generatedArray : newGenerateArray ,expandingWild ,wildMultipliar,wildMultipliarArray ,checkDevil }  
    }

    /**
     * this function use when wild card come in view zone and send responce 
     * @param {reel} reel 
     * @param {row} row 
     * @param {random} random 
     * @returns 
     */
    wildMult =(reel,row,random ) =>{

        let wildMultiPliar ={
            row : row,
            column : reel,
            MultiPliar:random
        }
        return wildMultiPliar;
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
     * check payline in matrix.
     * this function use when in view zone same symbole in payLine then this payline pay to use and count wallet.
     * @param {payarray} payarray array of kind of symbole pay
     * @param {matrix} matrixReelXCol marix of reel
     * @param {content} content database data
     * @param {pay} Pay paytable 
     * @returns 
     */
    checkPayline=(payarray,matrixReelXCol,content,Pay,checkDevil) =>{
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
                let unique = [...new Set(checkDevil)];
                // check devil card
                const found = unique.find(symbol => symbol === payline[rowOfPayArray]);
                if(found != payline[rowOfPayArray]){
                    // count same symbole in give payline
                    let countOfSym = this.countOfSymbol(matrixReelXCol,payline,rowOfMatrix);
                    let count = countOfSym.count;
                    let symbol = countOfSym.symbol;
                    if (count > 2){
                        if (symbol === 'WILD'){
                            break ;
                        }
                        // payline win count
                        let SymbolOfResult = this.buildPayLine(count,symbol,Pay,payline,content.betAmount,freeSpin,WinFreeSpinAmount);
                        result.push({symbol: SymbolOfResult.symbol,wintype: SymbolOfResult.wintype,Payline: SymbolOfResult.payline,WinAmount: SymbolOfResult.WinAmount});
                        winAmount += SymbolOfResult.WinAmount;
                        WinFreeSpinAmount = SymbolOfResult.WinFreeSpinAmount;
                    }
                }
                let check= matrixReelXCol[rowOfMatrix][rowOfPayArray];
                //checkScatter
                if (check === 'SCATTER' ){
                    sactterCount++;
                }
            }
        }
        if (sactterCount > 2){
            //freespin triger then this condition call
            let countOfFreeSpin = this.countOfFreeSpin(freeSpin,totalfreeSpin);
            freeSpin = countOfFreeSpin.freeSpin;
            totalfreeSpin = countOfFreeSpin.totalfreeSpin;
            
        }
        return {sactterCount,result ,wallet ,WinFreeSpinAmount,freeSpin,totalfreeSpin,winAmount}
    }


    /**
     * count same symbol in matrix.
     * @param {matrixOf reel} matrixReelXCol  REEL X COLUM matrix 
     * @param {payline} payline parray of line
     * @param {row} rowOfMatrix matrixReelXCol row
     * @returns count and symbol
     */
    countOfSymbol = (matrixReelXCol,payline,rowOfMatrix) => {
        let count = 0;
        let d = 0;
        let symbol = matrixReelXCol[rowOfMatrix][d];
        if(payline[0] === rowOfMatrix && symbol != 'DEVIL'){
            count++;
            for (let element = 1; element < payline.length; element++) {
                if (symbol === 'WILD' && matrixReelXCol[payline[element]][element] != 'DEVIL'){
                    symbol = matrixReelXCol[payline[element]][element];
                    count++;
                    continue;
                }
                if (matrixReelXCol[payline[element]][element] !== 'WILD' && matrixReelXCol[payline[element]][element] !== symbol){
                    break;
                }
                count++;
            }
        }
        return {count,symbol};
    }

    /**
     * this function use random Wild multipair 
     * @returns wild multipair
     */
    randomWildMul(wildMult){
        const element = Math.floor(Math.random() * ((2-0)+ 1) + 0);
        return wildMult[element];
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
        return {symbol,wintype: `${count}ofakind`,payline ,WinAmount : betAmount * multipler,WinFreeSpinAmount }
    }

    /**
     * when scatter > 2 then this function call 
     * @param {free spin} freeSpin 
     * @param {totalfreeSpin} totalfreeSpin 
     * @returns free spin and total free spin
     */
    countOfFreeSpin = (freeSpin,totalfreeSpin) =>{
        if(freeSpin > 0){
            totalfreeSpin += 3 ;
            freeSpin += 3; 
        }else{
            freeSpin =5 ;
            totalfreeSpin = freeSpin;
        }      
        return {freeSpin ,totalfreeSpin }
    }

    /**
     * set response freeSpin
     * @returns free spin details [numberOfFreespins, currentFreeSpin, freeSpinTriggered] 
     */
    freeSpin = (freeSpin , WinFreeSpinAmount , totalfreeSpin ) => {
        let scatterOffreeSpin = {
            numberOfFreespins: totalfreeSpin,
            remainingSpins: freeSpin,
            freeSpinTriggered: freeSpin === totalfreeSpin ? 'true' : 'false',
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

    /**
     * random generates gamble Card 
     * @param {low} low 
     * @param {high} high 
     * @returns card
     */
    randomGambleCard = (low,high)=>{
        let gambleCard = ["black","red"];
        const element = Math.floor(Math.random() * ((high-low)+ 1) + low);
        return gambleCard[element];
    }

    /**
     * this function use where user play gamble.
     * @param {req} req 
     * @param {result} result 
     * @returns gamblecounter,gambleWin,winInSpin
     */
    conutGamble = (req,result) => { 
        let winInSpin = result.content.winInSpin;
        let gamblecounter = result.content.gamblecounter;
        let gambleWin = result.content.gambleWin;
        let gamble_history = result.content.gamble_history;
        let gambleCard = this.randomGambleCard(0,1);
        if(req.body.card ===gambleCard){
            gamblecounter += 1;
            gambleWin = winInSpin;
            winInSpin = winInSpin *2;
            gamble_history.push(gambleCard);
        }else{
            gamblecounter = 0;
            gambleWin = 0;
            gamble_history = [];
            winInSpin = 0;
        }
        return {gambleWin ,winInSpin ,gamblecounter,gamble_history }
    }

    /**
     * this function used collect win amount
     * @param {result} result 
     * @returns 
     */
    collectWallet = (result) =>{
        let wallet = result.content.wallet;
        let winInSpin = result.content.winInSpin;
        let gamblecounter = result.content.gamblecounter;
        let gambleWin = result.content.gambleWin;
        let wildMultipliar =result.content.wildMultipliar;
        wallet = wallet + (winInSpin * wildMultipliar );
        if(gambleWin > 0 ){
            gamblecounter = 0;
            gambleWin = 0;
        }
        winInSpin = 0;
        wildMultipliar = 0;
        return {wallet ,winInSpin ,gamblecounter ,gambleWin ,wildMultipliar}
    }
}

const gameFunction = new GameHelper();
module.exports.gameHelper= gameFunction