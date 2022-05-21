const utf16KeyCipher = {
    permissionLevel: 2,
    cipherName: 'UTF-16 Unicode key-cipher'
}

utf16KeyCipher.cipher = function(text, key, decode) {

    if (!key) {
        throw new Error('Please! provide -key- to use this cipher.')
    }
    
    var bound = 0x10000;

    return String.fromCharCode.apply(null,

        text.split('').map(function(v, i) {

            var rotation = key[i % key.length].charCodeAt();

            if(decode) rotation = -rotation;

            return (v.charCodeAt() + rotation + bound) % bound;
        })
    );
};

module.exports = utf16KeyCipher