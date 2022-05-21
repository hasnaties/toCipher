const express = require('express');
const router = new express.Router();
const {auth, isPermission} = require('../middleware/auth')
const cipher0 = require('../ciphers/caeserCipher');
const cipher1 = require('../ciphers/utf16Cipher');
const cipher2 = require('../ciphers/utf16KeyCipher');
const {cipherResponse, errorResponse} = require('../responseTemplates/responses')

router.get('/decode', auth, async (req, res) => {

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


        let plainText = '';
        if (req.body.permissionLevel === "1") {
            plainText = await cipher1.cipher(req.body.message, req.body.rotation, true)
            cipherResponse.modify(plainText, cipher1.cipherName, false, true)
        }
        else if (req.body.permissionLevel === "2") {
            plainText = await cipher2.cipher(req.body.message, req.body.key, true);
            cipherResponse.modify(plainText, cipher2.cipherName, false, true)
        }
        
        else if(req.body.permissionLevel === "0"){
            plainText = await cipher0.cipher(req.body.message, true);
            cipherResponse.modify(plainText, cipher0.cipherName, false, true)
        }

        res.send(cipherResponse)

    } catch (error) {
        res.status(errorResponse.statusCode).send(errorResponse);
    }
});

module.exports = router;