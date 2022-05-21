const {errorResponse} = require('../responseTemplates/responses')

const caeserCipher = {
    permissionLevel: 0,
    cipherName: 'Caeser Cipher',
    map: {
        a: 'q', b: 'w', c: 'e',
        d: 'r', e: 't', f: 'y',
        g: 'u', h: 'i', i: 'o',
        j: 'p', k: 'a', l: 's',
        m: 'd', n: 'f', o: 'g',
        p: 'h', q: 'j', r: 'k',
        s: 'l', t: 'z', u: 'x',
        v: 'c', w: 'v', x: 'b',
        y: 'n', z: 'm'
    }
}

caeserCipher.valid = (text) => {

    let temp = text.toLowerCase().split('')
    let bool = true
    for (let index = 0; index < temp.length; index++) {
        if (!caeserCipher.map.hasOwnProperty(temp[index])) {
            bool = false
        }
    }
    return bool
}

caeserCipher.cipher = function(text, decode) {

    var map = caeserCipher.map;

    if (!caeserCipher.valid(text)) {
        errorResponse.modify('Text is not valid.', 400)
        throw new Error()
    }

    if(decode) {
        map = (function() {
            var tmp = {};
            var k;

            // Populate the tmp variable
            for(k in map) {
                if(!map.hasOwnProperty(k)) continue;
                tmp[map[k]] = k;
            }

            return tmp;
        })();
    }


        return text.split('').filter(function(v) {
            return map.hasOwnProperty(v.toLowerCase());
        }).map(function(v) {
            return map[v.toLowerCase()].toUpperCase();
        }).join('');
};

module.exports = caeserCipher