const cipherResponse = {
    message: '',
    cipheredUsed: '',
    encode: false,
    decode: false
}
cipherResponse.modify = (msg, used, en, de) => {
    cipherResponse.message = msg;
    cipherResponse.cipheredUsed = used;
    cipherResponse.encode = en;
    cipherResponse.decode = de ? de : false;
};

const errorResponse = {
    statusCode: 500,
    errorMessage: ''
}
errorResponse.modify = (msg, code) => {
    errorResponse.errorMessage = msg;
    errorResponse.statusCode = code;
};

module.exports = {cipherResponse, errorResponse}