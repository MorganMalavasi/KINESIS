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
    let password = req.body.password;
    let passwordrepeated = req.body.passwordrepeated;

    if (firstname == '' ||
        lastname == '' ||
        username == '' ||
        cel == '' ||
        password == '' ||
        passwordrepeated == '') {
        res.render('register-page', {
            msg: 'Hai dimenticato di inserire qualcosa! Riprova!'
        });
    }
    else if (password != passwordrepeated) {
        res.render('register-page', {
            msg: 'Le password che hai inserito non sono uguali! Riprova!'
        });
    } else {
        // insert user in db 
        try {
            const resEnterUser = await utilsUser.insertUser(firstname, lastname, username, cel, password);
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
    let password = req.body.password;

    try {
        const enter = await utilsUser.recoverUser(username, password);
        if (enter == 1) {
            res.render('mainUserPage', {
                name: username
            });
        } else if (enter == 2) {
            res.render('login-page', {
                msg: 'password incorretta, riprova'
            });
        }

    } catch (error) {
        res.render('login-page', {
            msg: error
        });
    }
});


module.exports = router;