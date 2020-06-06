const path = require('path');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
app.use(express.static('static'));

const PORT = process.env.PORT;

function main(req, res) {
    const useragent = req.get('User-Agent');
    if (useragent == 'eevee') {
        res.sendFile(path.join(__dirname, 'flag.html'));
    }
    else res.sendFile(path.join(__dirname, 'index.html'));
}

app.get('/', function(req, res) {
    main(req, res);
});
app.get('/index.html', function(req, res) {
    main(req, res);
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '404.html'));
});

const server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
 
    console.log("App listening at http://%s:%s", host, port);
})