const express = require('express');
const User = require('../models/user');
const router = new express.Router()
const {auth} = require('../middleware/auth')
const upload = require('../middleware/multerMiddleware')
const {welcomeEmail, lastEmail} = require('../emails/postmark')

router.post('/users/signup', async (req, res) => {

    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        welcomeEmail(user.email, user.name, token);
        res.status(201).send({
            message: "Your account credentials has sent to provided email-address.",
            accountConfirmation: true
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token})
        
    } catch (error) {
        res.status(400).send(error) 
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((arrayOfTokens) => {
            return arrayOfTokens.token !== req.token;
        })

        await req.user.save()
        res.send({message: "You've logged out successfully."})
        
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({message: "You've logged out from all the sessions."});
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
});


router.patch('/users/me', auth, async (req, res) => {

    const requested = Object.keys(req.body);
    const allowed = ['name', 'email', 'password', 'permissionLevel'];
    const isValidated = requested.every((request) => allowed.includes(request));

    if (!isValidated) {
        return res.status(400).send('Invalid Fields!')
    }

    try {

        requested.forEach((request) => req.user[request] = req.body[request])

        await req.user.save();
        res.send(req.user)

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send();
         }
        else{
            res.status(500).send(error)
        }
    }

})

router.delete('/users/me', auth, async (req, res) => {

    try {
        //lastEmail(req.user.email, req.user.name)
        await req.user.remove();
        res.status(202).send(req.user);

    } catch (error) {
        return res.status(500).send(error)
    }
})

// router.post('encode/image', auth, upload.single('avatar'), async(req, res) => {

//     req.user.avatar = req.file.buffer
//     //await req.user.save();
//     res.status(200).send({
//         message: 'File is uploaded.',
//         image: req.user.avatar
//     })

// }, (error, req, res, next) => {

//     res.status(400).send({error: error.message})
// })

// router.delete('/users/me/avatar', auth, async (req, res) => {
//     try {
//         req.user.avatar = undefined;
//         await req.user.save();
//         res.status(202).send({message: 'File is deleted.'})
//     } catch (error) {
//         res.status(400).send(error)
//     }
    
// })

module.exports = router;