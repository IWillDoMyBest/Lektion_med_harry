const express = require("express");
const http = require("http"); 
const fs = require("fs");
const request = require("request");

var app = express();
var port = 3000;
var server = http.createServer(app);

app.use(express.static(__dirname + "/static")); 

app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);

var valid_api = "";


app.get("/weather", (req, res) => {
	
	request("https://samples.openweathermap.org/data/2.5/forecast?id=2704620&appid=ba00057b00e2182cdc698d0317e3adb5", (err, resp, body) => {

		var temps = JSON.parse(body).list[0].main.temp;	
		
		res.render("index.hbs", {
			temp : temps - 273.15
		});
	});

});

app.get("/render", (req, res) => {
	res.render("index.hbs", {
		title : "Hej på dig"
	});
});

app.get("/", (req, res) => {
	res.send("<h1>Hello World!</h1>");
});

app.get("/users/:api/:name", (req, res) => {
	var api = req.params.api;
	
	if (api != valid_api) {
		return res.send("Du har inte tillgång till detta");
	}
	
	var data ={};
	data.table = [];	

	var obj = {
		name : req.params.name
	};

	data.table.push(obj);

	fs.appendFile("db.json", JSON.stringify(data), (err) => {
		if (err) {
			return res.send(err);
		}
	
		res.send("Du lyckades");
	});



});

app.get("/users/get/:api/:name", (req, res) => {

	var api = req.params.api;

	if (api != valid_api) {
		return res.send("Du har inte tillgång");
	}

	fs.readFile("db.json", (err, data) => {

		if (err) {
			return res.send(err);
		}

		res.send(JSON.parse(data));

	});


});

server.listen(port, () => { 
	console.log("Server is running on port 3000");
});













