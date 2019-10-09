const express = require('express');
const router = express.Router();
const utilsAdmin = require('./utils/utilsAdmin');

router.get('/', (req, res) => {
    res.render('admin');
});

router.get('/list/users', async (req, res) => {

    try {
        let listUsers = await utilsAdmin.getlistUsers();
        console.log(listUsers);
        if (typeof listUsers != undefined
            && listUsers != null
            && listUsers.length != null
            && listUsers.length > 0) {
            res.render('operations/listUser', {
                stackUsers: listUsers
            });
        } else {
            res.render('operations/listUser');
        }
    } catch (err) {
        console.log(err);
        res.render('operations/listUser');
    }
});

router.get('/delete/user', async (req, res) => {
    let idUser = req.query.userId;
    // delete user with idUser id
    try {
        await utilsAdmin.deleteUser(idUser);
        res.render('admin');
    } catch (err) {
        console.log(err);
        res.status(204).send('IMPOSSIBILE ELIMINARE UTENTE  Errore = ' + err);
    }
});

router.get('/newcourse', (req, res) => {
    res.render('operations/newCourse');
});

router.get('/list/lessons', async (req, res) => {

    try {
        let stackLessons = await utilsAdmin.getAllLessons();
        if (typeof stackLessons != undefined
            && stackLessons != null
            && stackLessons.length != null
            && stackLessons.length > 0) {
            res.render('operations/listLessons', {
                stackLessons: stackLessons
            });
        } else {
            res.render('operations/listLessons', {
                msg: 'Non ci sono lezioni nel Database',
            });
        }
    } catch (err) {
        console.log(err);
        res.render('operations/listLessons', {
            msg: 'Impossibile disporre lezioni, cod. errore = ' + err,
        });
    }
});


module.exports = router;