initGame();

function initGame(){

    var gameContainer = $("#Game_Container");

    $(document).ready(function(){

        getQuestion();

        $("#Game_Container").click(function(){
            getQuestion();
        });

        $("#Game_Restart").click(function(e){
            e.preventDefault();

            $.post("api/restartGame")
                .done(function(){
                    window.location.href ="/";
                })
                .fail(handleFail)
                .always(function(){
                    //stop loading
                });
        });

    });

    function getQuestion(){

        gameContainer.animate({ opacity: 0}, 500, function(){

            $.post("/api/getQuestion")
                .done(function(response){
                    if(response.question){
                        drawQuestion(response.question);
                    }
                })
                .fail(handleFail)
                .always(function(){
                    //stop loading
                });
        });
    }

    function drawQuestion(question){
        var questionContainer = $("#Game_QuestionContainer");
        questionContainer.text(question);

        gameContainer.animate({ opacity: 1}, 500, function(){
            // done
        });
    }

    function handleFail(error){
        console.error(error);
    }
    
}