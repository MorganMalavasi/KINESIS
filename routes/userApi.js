const express = require('express');
const router = express.Router();
const utilsUser = require('./utils/utilsUser');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/registerUser', async (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let mail = req.body.mail;
    let password = req.body.password;
    let cel = req.body.cel;

    if (firstname == '' ||
        lastname == '' ||
        mail == '' ||
        password == '' ||
        cel == '') {
        res.render('register-page', {
            msg: 'Hai dimenticato di inserire qualcosa! Riprova!'
        });
    } else {
        // insert user in db 
        try {
            const resEnterUser = await utilsUser.insertUser(firstname, lastname, mail, password, cel);
            console.log(resEnterUser);
            if (resEnterUser == 1)
                res.render('login-page');
            else if (resEnterUser == 2) {
                res.render('register-page', {
                    msg: 'Utente già esistente, cambia e riprova!'
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
    let mail = req.body.username;
    let password = req.body.password;

    console.log(password);

    try {
        let id_user = await utilsUser.recoverUser(mail, password);
        res.render('mainUserPage', {
            name: mail,
            user: id_user
        });
    } catch (error) {
        res.render('login-page', {
            msg: error
        });
    }
});


module.exports = router;