var read = require('../lib/read');

var teaspoons = 100;

read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(parse)
    .then(index)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var matcher = /([A-z]+): (.*)/;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        var ingredient = {
            name: matches[1],
            properties: {}
        };
        var properties = matches[2].split(', ');
        console.log(ingredient.name);
        properties.forEach(function(property) {
            console.log('', property);
            var s = property.split(' ');
            var key = s[0];
            var value = parseInt(s[1]);
            ingredient.properties[key] = value;
        });
        console.log();
        return ingredient;
    });
}

function index(ingredients) {
    var index = {};
    ingredients.forEach(function(ingredient) {
        index[ingredient.name] = ingredient.properties;
    });
    return index;
}

function solve(index) {
    var ingredients = Object.keys(index);
    var recipe = makeRecipe(ingredients, teaspoons);

    var recipes = solveFor(recipe, index, ingredients, []);
    return {
        best,
        steps,
        winners: recipes.length
    };
}

function makeRecipe(ingredients, teaspoons) {
    var recipe = {};

    var take = (function() {
        var remaining = teaspoons;
        return function(requestedAmount) {
            var availableAmount = Math.min(requestedAmount, remaining);
            remaining = remaining - availableAmount;
            return availableAmount;
        }
    })();

    var portion = Math.ceil(teaspoons / ingredients.length);
    ingredients.forEach(function(ingredient) {
        recipe[ingredient] = take(portion);
    });

    return recipe;
}

var steps = 0;
var best = {
    score: 0
};

function solveFor(recipe, index, ingredients, route) {
    var results = [];

    var result = scoreRecipe(recipe, index);

    steps++;

    if (result.score > best.score) {
        best = result;
        results.push(result);

        ingredients.forEach(function(ingredient) {
            var moreOfX = tweakRecipe(recipe, ingredient, 1);
            var moreOfXResults = solveFor(moreOfX, index, ingredients, [].concat(route, ingredient));
            results = results.concat(moreOfXResults);

            var lessOfX = tweakRecipe(recipe, ingredient, -1);
            var lessOfXResults = solveFor(lessOfX, index, ingredients, [].concat(route, ingredient));
            results = results.concat(lessOfXResults);
        });
    }

    return results;
}

function tweakRecipe(recipe, ingredientToTweak, amount) {
    var teaspoons = 0;
    var ingredients = Object.keys(recipe);
    ingredients.forEach(function(ingredient) {
        teaspoons = teaspoons + recipe[ingredient];
    });

    var take = (function() {
        var remaining = teaspoons;
        return function(requestedAmount) {
            var availableAmount = Math.min(requestedAmount, remaining);
            remaining = remaining - availableAmount;
            return availableAmount;
        }
    })();

    var tweakedRecipe = {};
    var tweakedPortion = Math.max(0, recipe[ingredientToTweak] + amount);
    tweakedRecipe[ingredientToTweak] = take(tweakedPortion);

    ingredients.forEach(function(ingredient) {
        if (ingredient !== ingredientToTweak) {
            tweakedRecipe[ingredient] = take(recipe[ingredient]);
        }
    });

    return tweakedRecipe;
}

function scoreRecipe(recipe, index) {
    var properties = {};
    var result = {
        recipe,
        properties
    };

    Object.keys(recipe).forEach(function(ingredient) {
        var quantity = recipe[ingredient];
        Object.keys(index[ingredient]).forEach(function(property) {
            properties[property] = (properties[property] || 0) + (index[ingredient][property] * quantity);
        });
    });

    Object.keys(properties).forEach(function(property) {
        properties[property] = Math.max(0, properties[property]);
    });

    result.score = properties.capacity * properties.durability * properties.flavor * properties.texture;

    return result;
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}