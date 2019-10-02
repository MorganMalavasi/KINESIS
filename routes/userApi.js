const express = require('express');
const router = express.Router();
const utilsUser = require('./utils/utilsUser');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/registerUser', async (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let cel = req.body.cel;

    if (firstname == '' ||
        lastname == '' ||
        username == '' ||
        cel == '') {
        res.render('register-page', {
            msg: 'Hai dimenticato di inserire qualcosa! Riprova!'
        });
    } else {
        // insert user in db 
        try {
            const resEnterUser = await utilsUser.insertUser(firstname, lastname, username, cel);
            console.log(resEnterUser);
            if (resEnterUser == 1)
                res.status(200).send('Utente aggiunto correttamente');
            else if (resEnterUser == 2) {
                res.render('register-page', {
                    msg: 'Username già esistente, cambia e riprova!'
                });
            }
        } catch (error) {
            res.render('register-page', {
                msg: error
            });
        }
    }
});

router.post('/loginUser', async (req, res) => {
    let username = req.body.username;

    try {
        await utilsUser.recoverUser(username);
        res.render('mainUserPage', {
            name: username
        });
    } catch (error) {
        res.render('login-page', {
            msg: error
        });
    }
});


module.exports = router;