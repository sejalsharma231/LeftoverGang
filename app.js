var express = require("express");
var app = express();
const request = require("request");
const parse = require("body-parser");


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));
app.get("/", function(req, res){
res.render("search");
});



app.get("/results", (req, res) => {
var query = Object.keys(req.query);
var time = Object.values(req.query);
console.log(query);
if(time[1] === ''){
time[1]= 100;
}
var url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=87cd4bfc97bc4e269b669d1808f92484&includeIngredients="
     + query[0] +"&addRecipeInformation=true&maxReadyTime="+ time[1]+"&max&number=1000";
 request(url , (error, response, body )=> {
if(!error && response.statusCode === 200){
var result = JSON.parse(body);
res.render("results", {result: result, query:query, time:time});

}else {
console.log(error);
 }
});
});

var port = process.env.PORT || 3000;
app.listen(3000, function () {
  console.log("Server Has Started!");
});