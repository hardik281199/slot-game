module.exports  = {
    gameVariable :{
        game: "MyJackpot",
        static: {
        viewZone: {
            "rows": 3,
            "columns": 5
        },
        payarray: [[0,0,0,0,0],[1,1,1,1,1],[ 2,2,2,2,2],[0,0,1,2,2],[2,2,1,0,0]],
        payTable:{"H1": {
                    "3ofakind": 50,
                    "4ofakind": 150,
                    "5ofakind": 500
                    },
                    "H2": {
                    "3ofakind": 40,
                    "4ofakind": 100,
                    "5ofakind": 250
                    },
                    "H3": {
                    "3ofakind": 30,
                    "4ofakind": 100,
                    "5ofakind": 150
                    },
                    "A": {
                    "3ofakind": 20,
                    "4ofakind": 40,
                    "5ofakind": 80
                    },
                    "K": {
                    "3ofakind": 10,
                    "4ofakind": 20,
                    "5ofakind": 40
                    },
                    "J": {
                    "3ofakind": 5,
                    "4ofakind": 10,
                    "5ofakind": 20
                    },
                    "SCATTER": {
                      "3ofakind": 10,
                      "4ofakind": 20,
                      "5ofakind": 40
                    }
                },
        arrayOfReel: [["H1","H2","H3","H1","K","WILD","J","A","H3","SCATTER","DEVIL"],
                        ["WILD","J","H3","H1","DEVIL","SCATTER","H1","H2","A","K","A"],
                        ["H1","J","H3","SCATTER","H1","H2","A","DEVIL","J","K","WILD"],
                        ["SCATTER","WILD","DEVIL","H2","A","J","H1","H3","K","H1","K"],
                        ["J","A","H1","K","H3","H2","DEVIL","WILD","A","SCATTER","H1"]],
        maxWinAmount : 110000,
        wildMult : [2,4,6],
        gambleCard : ["black","red"]
        }
    }
    
}