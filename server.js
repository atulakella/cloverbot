var { spawn } = require('child_process');
var express = require('express');
var bodyparser = require('body-parser');
var urlencodedparser = bodyparser.urlencoded({extended:false})
const app = express();

// myfunc();
const listener = app.listen(8080, () => {
    console.log("Web app running at localhost:8080");
});
  
app.use(express.static('public'));

app.post("/getresponse", urlencodedparser, async (request, response) => {
    // express.static('public');
    // console.log(request.body.field1);
    // console.log('req received');
    var response1 = await getresponsefrompy(request.body.searchword, request.body.text);
    response.send(response1);
});

function getresponsefrompy(searchword, text){
    return new Promise(resolve => {
        const responsearr = [];
        const sensor = spawn('python', ['./chatbot.py', searchword, text]);
        sensor.stdout.on('data', function(data) {
            resolve(String(data));
            // console.log(String(data));
        });
    });
}
    


