const express = require('express');
const app = express();


// extras
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bodyParser = require("body-parser");

// ENV Vars
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); 

app.listen(port, () => console.log(`Website live at ${port}!`))

var players = [];
var currentRound = [];
var usedQuestions = [];
var questions = JSON.parse(fs.readFileSync('questions.json'));

app.get("*", function(req,res,next){

    if(!req.path.includes(".")){
        if(players.length < 2){
            if(req.path != "/setup"){
                return res.redirect("/setup");
            }
        } else{
            if(req.path != "/game"){
                return res.redirect("/game");
            }
        }
    }

    next();
});
app.get("/game", function(req,res){
    res.sendFile(path.join(__dirname + '/pages/game.html'));
});
app.get("/setup", function(req,res){
    res.sendFile(path.join(__dirname + '/pages/setup.html'));
});

app.post("/api/addPlayer/:playerName", function(req,res){
    var playerName = req.params.playerName;
    if(typeof playerName == "string"){
        if(playerName != ""){
            players.push({id: uuidv4(), name : playerName});
        }
        return res.send(200);
    }

    return res.send(503);
})
app.post("/api/getPlayers", function(req,res){
    return res.json({players: players});
})
app.post("/api/removePlayer/:id", function(req,res){
    var id = req.params.id;

    var i = players.findIndex(p => p.id == id);

    if(i != -1){
        players.splice(i, 1);
    }

    return res.sendStatus(200);
});
app.post("/api/getQuestion", function(req,res){

    if(currentRound.length < 1){
        // init new round
        currentRound = shuffle([...players]);
    }

    var player1 = currentRound[0];
    var player2 = getPlayer2(player1);

    var question = getQuestion(player2);

    question = question.replace("{1}", player1.name);
    question = question.replace("{2}", player2.name);

    currentRound.shift();

    return res.json({question: question});
})
app.post("/api/restartGame", function(req,res){

    players = [];
    currentRound = [];
    usedQuestions = [];

    res.sendStatus(200);

})

app.use(express.static("public"));

function getQuestion(player2){

    // NEED TO: Check if player2 has q's left

    var q = questions[Math.floor(Math.random() * questions.length)];

    var usedBefore = usedQuestions.findIndex(uq => uq.player2 == player2 && uq.question == q) != -1 ;

    if(usedBefore){
        return getQuestion(player2);
    }

    usedQuestions.push({ player2 : player2, question : q});

    return q;
}
function getPlayer2(player1){
    var player2 = players[Math.floor(Math.random() * players.length)];
    if(player2.id == player1.id){
        return getPlayer2(player1);
    }
    return player2;
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}