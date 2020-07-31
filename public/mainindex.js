
class usermsg{
    constructor(){
        this.searchword = "";
        this.text = "";
    }
}

var usermsgvar = new usermsg();

$(document).ready(function() {
    var chatwindowtogglestate = false;

    $("#usersendmsgbtn").on("usermsgsent", async (event) => {
        var response = await getinputfrompy(usermsgvar.searchword, usermsgvar.text);
        botsendmsg(response);
        botreplyingmode(false);
    });

    var greetings = ["hi", "hey", "*nods*", "hi there", "hello", "I am glad! You are talking to me"];
    
    $("#chatinitiatebtnactual").click(() => {
        botsendmsg(greetings[Math.floor(Math.random() * 6)]);
        togglechatwindow();
        scrollchatwindowtobottom();
    }); 

    $("#minimizechatbtn").click(() => {
        togglechatwindow();
    });

    $("#usersendmsgbtn").click(() => {
        if($("#usermsginput").val() != ""){
            if($("#userdatainput").val() != ""){
                botreplyingmode(true);
                sendmsg("user", $("#usermsginput").val());
                usermsgvar.searchword = $("#usermsginput").val();
                usermsgvar.text = $("#userdatainput").val();
                $("#usermsginput").val("");
                $("#usersendmsgbtn").trigger('usermsgsent');
            }else{
                alert("Data field cannot be empty!");
            }

             // RUN PYTHON HERE
        }else{
            alert("Empty message can't be sent!");
        }
    });

    function botreplyingmode(mode){
        if(mode == true){
            $("#usersendmsgbtn").prop('disabled', true);
            $("#usermsginput").prop('disabled', true);
            $("#typingstatuslabel").css('display', 'block');
        }else{
            $("#usersendmsgbtn").prop('disabled', false);
            $("#usermsginput").prop('disabled', false);
            $("#typingstatuslabel").css('display', 'none');
        }
    }

    function togglechatwindow(){
        if(chatwindowtogglestate == false){
            chatwindowtogglestate = true;
            $("#chatwindow").css({'display': 'block'});
            $("#chatinitiatebtn").css({'display': 'none'});
            $("#chatwindow").css({'animation-name': 'chatwindowpopupanim'});
            setTimeout(() => {
                $("#chatwindow").css({'animation-name': ''});
            }, 1000);

        }else{
            chatwindowtogglestate = false;
            $("#chatwindow").css({'animation-name': 'chatwindowpopdownanim'});
            setTimeout(() => {
                $("#chatwindow").css({'animation-name': ''});
                $("#chatwindow").css({'display': 'none'});
                $("#chatinitiatebtn").css({'display': 'block'});
            }, 1000);
        }
    };

    function getinputfrompy(searchword, text){
        return new Promise(resolve => {
            $.ajax({ 
                url: '/getresponse',
                type: 'POST',
                cache: false, 
                data: { searchword: searchword, text: text }, 
                success: function(data){
                    resolve(data);
                }
                , error: function(jqXHR, textStatus, err){
                    resolve("I do not understand!")
                }
             })
        })
    };

    function botsendmsg(msg){
        sendmsg("bot", msg);
    }

    function sendmsg(mode, msgcontent){
        var msghtml;
        if(mode == "bot"){
            msghtml = "<div class='botmsgspan'> <div class='botmsg'> <div class='msgcontents'> <h6>"+msgcontent+"</h6> </div> </div> </div>";
        }else {
            msghtml = "<div class='usermsgspan'> <div class='usermsg'> <div class='msgcontents'> <h6>"+msgcontent+"</h6> </div> </div> </div>";
        }
        $("#chatwindowmsgscontainer").append(msghtml);
        scrollchatwindowtobottom();
    };

    function scrollchatwindowtobottom(){
        $("#chatwindowcontents").scrollTop($("#chatwindowmsgscontainer").prop("scrollHeight"));
    }
});

