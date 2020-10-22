initSetup();

function initSetup(){

    $(document).ready(function(){

        refreshPlayers();

        $("#Setup_AddPlayer").submit(function(e){
            e.preventDefault();

            var $playerName = $("#Setup_AddPlayer_PlayerName");
            var playerName = $playerName.val();

            $.post("/api/addPlayer/"+playerName)
                .done(function(response){
                    refreshPlayers();
                    $playerName.val("");
                })
                .fail(handleFail)
                .always(function(){
                    //stop loading
                });
        });

        $("body").on("click",".fr-setup-players-item", function(){
            var id = $(this).parent().attr("data-id");
            
            $.post("/api/removePlayer/"+id)
                .done(function(response){
                    refreshPlayers();
                })
                .fail(handleFail)
                .always(function(){
                    //stop loading
                });
        });

    });

    function refreshPlayers(){
        $.post("/api/getPlayers")
            .done(function(response){
                if(response.players){
                    drawPlayers(response.players);
                }
            })
            .fail(handleFail)
            .always(function(){
                //stop loading
            });
    }

    function drawPlayers(players){
        var list = $(".fr-setup-players ul");

        list.empty();

        players.forEach(player => {
            list.append(`<li data-id=${player.id}>
                <div class="fr-setup-players-item">
                    ${player.name}
                </div>
            </li>`);
        });

        if(players.length < 1){
            list.append(`<li>No users added.</li>`)
        }
    }

    function handleFail(error){
        console.error(error);
    }
    
}