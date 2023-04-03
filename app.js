var express = require("express");
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/languages.db');

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/", (req, res, next) => {
    return res.json({"status": "ok"});
});

app.get("/getLanguages", (req, res, next) => {

    db.all('SELECT * FROM languages', (err, rows) => {
        if(err) {
            return console.log(err.message); 
        }

        return res.json(rows);

    //     let result = [];
    //     rows.forEach((row) => {
    //         result.push(JSON.parse(row.json));
    //     });
    //     res.json(result);
    })
});

app.post("/addLanguage", (req, res, next) => {

    db.run('INSERT INTO languages (name, alphabet, country) VALUES (?, ?, ?)', [req.body.name, req.body.alphabet, req.body.country], (err) => {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Row was added to the table: ${this.lastID}');
    })
    // const stmt = db.prepare('INSERT INTO languages (name, alphabet, country) VALUES (?, ?, ?)');
    // stmt.run({$name: req.body.name, $alphabet: req.body.alphabet, $country: req.body.country}, function(err) {
    //     if (err) {
    //         return console.log(err.message);
    //     }
    //     // get the last insert id
    //     console.log(`A row has been inserted with rowid ${this.lastID}`);
    // });

    res.json('{"status": "succesful"}');
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    db.close();
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));