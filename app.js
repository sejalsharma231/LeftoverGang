var express = require("express");
var app = express();
const request = require("request");
const parse = require("body-parser");


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));
app.get("/", function (req, res) {
    res.render("search");
});



app.get("/results", (req, res) => {
    var query = Object.keys(req.query);
    var time = Object.values(req.query);
    console.log(query);
    if (time[1] === '') {
        time[1] = 100;
    }
    const apiKey = '87cd4bfc97bc4e269b669d1808f92484';
    // var url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=87cd4bfc97bc4e269b669d1808f92484&includeIngredients?="
    //      + query[0] +"&ranking=1&addRecipeInformation=true&maxReadyTime="+ time[1]+"&max&number=2";
    // var url = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=87cd4bfc97bc4e269b669d1808f92484&ingredients="
    //      + query[0] +"&ranking=1&addRecipeInformation=true&maxReadyTime="+ time[1]+"&max&number=1";
    var url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&includeIngredients=${query[0]}&fillIngredients=true&addRecipeInformation=true&maxReadyTime=${time[1]}&number=10`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            var result = JSON.parse(body);
            console.log(result);
            result.results.sort((recipeA, recipeB) => {
                const missingIngredientsA = recipeA.missedIngredientCount;
                const missingIngredientsB = recipeB.missedIngredientCount;
              
                return missingIngredientsA - missingIngredientsB;
              });
            res.render("results", { result: result, query: query, time: time });

        } else {
            console.log(error);
        }
    });
});

// var port = process.env.PORT || 400;
var port = 4000;
app.listen(port, function () {
    console.log("Server Has Started!");
});