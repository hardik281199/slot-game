class GameHelper{

    /**
     * It generates an array of random numbers
     * these random numbers will be used to generate viewzone
     * @param {low}  first index of reel config
     * @param {high} last index of reel config
     * @returns ArrayOfNumbers Ex :[1,2,3,4,5]
     */
     randomInt(low, high){ 
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
    getSymbol(randomArr,arrayOfReel ,reelLength, reel, col){
        let symbol = arrayOfReel[(randomArr[reel] + col) % reelLength];
        return symbol;
    }

    /**
     * generate ViewZone
     * @param {randomNumber} randomNumber array of randomNumber 
     * @param {arrayOfReel} arrayOfReel arrayOfReel 
     * @returns viewZone And Mattix OfReel
     */
    generateViewZone = (randomNumber,arrayOfReel) =>{
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
        for(let reel = 0;reel < 5;reel++){
            for(let col = 0; col< 3; col++) {
                const symbol = this.getSymbol(randomNumber,arrayOfReel[reel],arrayOfReel[reel].length, reel, col);
                viewZone[`reel${reel}`].push(symbol);
            }
            generatedArray.push(viewZone[`reel${reel}`])
        }
        return {"generatedArray" : generatedArray,"viewZone" :  viewZone}
    }

    /**
     * set response freeSpin
     * @returns free spin details [numberOfFreespins, currentFreeSpin, freeSpinTriggered] 
     */
    freeSpin(freeSpin , WinFreeSpinAmount , totalfreeSpin ){
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
    debitWinAmount (wallet,betAmount){
         wallet -= betAmount ;
        return wallet
    }

    /**
     * whenever free spin occurred 
     * @param {multipler} multipler total win amount
     * @returns in free spin count total win amount
     */
    creditWinAmount(multipler,betAmount , WinFreeSpinAmount){
        WinFreeSpinAmount += betAmount * multipler;

        return WinFreeSpinAmount;
    }
}

const gameFunction = new GameHelper();
module.exports.gameHelper= gameFunction