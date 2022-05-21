const utf16Cipher = {
    permissionLevel: 1,
    cipherName: 'UTF-16 Unicode cipher'
}

utf16Cipher.cipher = function(text, rotation, decode) {

    if (!rotation) {
        throw new Error('please provide rotation please.')
    }

    var bound = 0x10000;
    rotation = parseInt(rotation) % bound;
    if (decode) {
        rotation = -rotation
    }

    if(rotation === 0) return text;

    return String.fromCharCode.apply(null,
        text.split('').map(function(v) {

            return (v.charCodeAt() + rotation + bound) % bound;
        })
    );
};

module.exports = utf16Cipher