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

    return [
        solveFor(recipe, index),
        solveFor({
            Butterscotch: 44,
            Cinnamon: 56
        }, index)
    ];
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

function solveFor(recipe, index) {
    return scoreRecipe(recipe, index);
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