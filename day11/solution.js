var read = require('../lib/read');

var allowedCharacters = 'abcdefghjkmnpqrstuvwxyz'.split('');

if (testForPairs(numerize('xxyy')) && testForPairs(numerize('abbcvvx')) && testForIncreasingStraight(numerize('abc')) && testForIncreasingStraight(numerize('ggrjfxyza'))) {
    read(__dirname + '/input.txt', 'utf8')
        .then(numerize)
        .then(solve)
        .then(report)
        .catch(error);
} else {
    console.log('Failed startup tests');
}

function numerize(string) {
    var letters = string.split('');
    return convertLettersToNumbers(letters);
}

function convertStringToArray(input) {
    console.log('Input', input);
    return input.split('');
}

function convertLettersToNumbers(letters) {
    return letters.map(function(char) {
        return allowedCharacters.indexOf(char);
    });
}

function convertNumbersToLetters(numbers) {
    return numbers.map(function(index) {
        return allowedCharacters[index];
    });
}

function solve(password) {
    password = generateIncrement(password);
    var c = 1;
    while (testPassword(password) === false) {
        password = generateIncrement(password);
        if (c % 1000 === 0) {
            console.log(convertNumbersToLetters(password).join(''), c);
        }
        c++;
    }

    var result = convertNumbersToLetters(password).join('');
    return {
        result,
        increments: c
    };
}

function generateIncrement(password) {
    var increase = (last(password) + 1);
    last(password, increase);
    carryOver(password);
    return password;
}

function carryOver(password) {
    var base = allowedCharacters.length;
    for (var i = 1; i < password.length; i++) {
        var value = password[password.length - i];
        if (value >= base) {
            var spare = (value % base);
            var carry = Math.floor(value / base);
            password[password.length - i] = spare;
            password[password.length - i - 1] = password[password.length - i - 1] + carry;
        }
    }
}

function testPassword(password) {
    return testForPairs(password) && testForIncreasingStraight(password);
}

function testForPairs(password) {
    var foundFirstPair = false;
    var previous, current;
    for (var i = 1; i < password.length; i++) {
        previous = password[i-1];
        current = password[i];
        if (current === previous) {
            if (!foundFirstPair) {
                foundFirstPair = true;
                i++;
            } else {
                return true;
            }
        }
        previous = current;
    }
    return false;
}

function testForIncreasingStraight(password) {
    var first, second, third;
    for (var i = 2; i < password.length; i++) {
        first = password[i - 2];
        second = password[i - 1];
        third = password[i];
        if (third - second === 1 && second - first == 1) {
            return true;
        }
    }
    return false;
}

function last(array, value) {
    if ('undefined' !== typeof value) {
        array[array.length - 1] = value;
    }
    return array[array.length - 1];
}


function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}