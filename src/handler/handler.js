const fs = require('fs');
const logger = require('@greencoast/logger');
let data = require('../../data.json');

// I didn't do this I swear
function trainD(args, initial) {
    
    if (args.length < 2) return;

    let word = args[0];
    let next = args[1];

    let present = false;
    Array.prototype.forEach.call(data, obj => {
        if (obj.word == word) {
            present = true;
        }
    });

    if(!present) {
        let obj = {
              word: word,
              probabilities: [next]
        };
        if (initial == -1) {
            obj.initializer = true;
        }
        else if (initial == 1) {
            obj.ends = true;
        }
        Array.prototype.push.call(data, obj);
    } else {
        data = Array.prototype.map.call(data, obj => {
            if(obj.word == word) {
                obj.probabilities.push(next);
                return obj;
            }
            return obj;
        });
   }

   trainD(args.slice(1), 0);

}

function train(args) {
    trainD(args, -1);
}

function random(limit) {
    return Math.floor(Math.random() * limit);
}

function createSentence(words) {
    if(words.length == 0) {
        let initializers = Array.prototype.filter.call(data, d => d.initializer);
        let rd = initializers[random(initializers.length)];
        if (rd) {
            Array.prototype.push.call(words, rd.word);
        } else {
            Array.prototype.push.call(words, data[random(data.length)].word);
        }
    }

    let last = words[words.length - 1];
    let savedWord = Array.prototype.find.call(data, d => d.word == last);

    if (!savedWord) {
        return words;
    }

    let nexts = savedWord.probabilities;
    let nextN = random(nexts.length);

    let next = nexts[nextN];
    words.push(next);

    if (random(100) < 80) {
        words = createSentence(words);
    }

    return words;
}

function toObj(word) {

    return data.find(d => d.word == word) | { ends: false };

}

function save() {
    fs.writeFile("./data.json", JSON.stringify(data), err => {
        if (err) logger.error(err);
    });
}


module.exports.save = save;
module.exports.createSentence = createSentence;
module.exports.train = train;