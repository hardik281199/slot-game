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

    // /**
    //  * create Payline in view zone
    //  * @returns array of payline ex : [0,0,0,0,0]
    //  */
    // payarray(){
    //     let Payline = [[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,0,1,2,2],[2,2,1,0,0]];        
    //     return Payline;
    // }

    // /**
    //  * this function use where pair come in view zone
    //  * @returns json data of smymbol of kind multipler
    //  */
    // paytable(){
    //     let payTable = {
    //         "H1":{
    //             "3ofakind":50,
    //             "4ofakind":150,
    //             "5ofakind":500
    //         },
    //         "H2":{
    //             "3ofakind":40,
    //             "4ofakind": 100,
    //             "5ofakind": 250
    //         },
    //         "H3":{
    //             "3ofakind": 30,
    //             "4ofakind": 100,
    //             "5ofakind": 150
    //         },
    //         "A":{
    //             "3ofakind": 20,
    //             "4ofakind": 40,
    //             "5ofakind": 80
    //         },
    //         "K":{
    //             "3ofakind": 10,
    //             "4ofakind": 20,
    //             "5ofakind": 40
    //         },
    //         "J":{
    //             "3ofakind": 5,
    //             "4ofakind": 10,
    //             "5ofakind": 20
    //         }
    //     }
    //     return payTable;
    // }

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