const express = require('express');
const router = new express.Router();
const {auth, isPermission} = require('../middleware/auth')
const cipher0 = require('../ciphers/caeserCipher');
const cipher1 = require('../ciphers/utf16Cipher');
const cipher2 = require('../ciphers/utf16KeyCipher');
const {cipherResponse, errorResponse} = require('../responseTemplates/responses')

router.get('/encode', auth, async (req, res) => {

    const requested = Object.keys(req.body);
    const required = ['message', 'permissionLevel'];
    const isValidated = required.every((require) => requested.includes(require));

    // -- validation conditions --
    try {

    if (!isValidated) {
        errorResponse.modify('Incomplete Fields.', 400);
        throw new Error()
    }

    if (! await isPermission(req)) {
        errorResponse.modify('Requested permission is unauthorized.', 403)
        throw new Error()
    }

    //-- Ciphering --

        let ciphered = '';
        if (req.body.permissionLevel === "1") {
            ciphered = await cipher1.cipher(req.body.message, req.body.rotation)
            cipherResponse.modify(ciphered, cipher1.cipherName, true)
        }
        else if (req.body.permissionLevel === "2") {
            ciphered = await cipher2.cipher(req.body.message, req.body.key);
            cipherResponse.modify(ciphered, cipher2.cipherName, true)
        }
        
        else if(req.body.permissionLevel === "0"){
            ciphered = await cipher0.cipher(req.body.message);
            cipherResponse.modify(ciphered, cipher0.cipherName, true)
        }

        res.send(cipherResponse)

    } catch (error) {
       res.status(errorResponse.statusCode).send(errorResponse);
    }
});

module.exports = router;