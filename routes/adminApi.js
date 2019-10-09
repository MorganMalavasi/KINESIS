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
                stackLessons: stackLessons,
                msg: ''
            });
        } else {
            res.render('operations/listLessons', {
                stackLessons: [],
                msg: 'Non ci sono lezioni nel Database',
            });
        }
    } catch (err) {
        console.log(err);
        res.render('operations/listLessons', {
            stackLessons: [],
            msg: 'Impossibile disporre lezioni, cod. errore = ' + err,
        });
    }
});

router.get('/delete/lesson', async (req, res) => {

    // delete lesson from database 
    let idLesson = req.query.idLesson;
    try {
        await utilsAdmin.deleteSingleLesson(idLesson);
        res.render('admin');

    } catch (err) {
        console.log(err);
        res.status(204).send('IMPOSSIBILE ELIMINARE LEZIONE Errore = ' + err);
    }
});

router.get('/listusersinlesson', async (req, res) => {
    // get all users in lesson
    let idLesson = req.query.idLesson;
    try {
        let stackUsersofLesson = await utilsAdmin.getAllUsersOfLesson(idLesson);
        if (typeof stackUsersofLesson != undefined
            && stackUsersofLesson != null
            && stackUsersofLesson.length != null
            && stackUsersofLesson.length > 0) {
            res.render('operations/listLessonUsers', {
                idLesson: idLesson,
                stackUsersofLesson: stackUsersofLesson,
                msg: ''
            });
        } else {
            res.render('operations/listLessonUsers', {
                idLesson: idLesson,
                stackUsersofLesson: [],
                msg: 'Non ci sono utenti iscritti alla lezione',
            });
        }
    } catch (err) {
        console.log(err);
        res.render('operations/listLessonUsers', {
            idLesson: idLesson,
            stackUsersofLesson: [],
            msg: 'Impossibile disporre utenti per la lezione, cod. errore = ' + err,
        });
    }
});

router.get('/delete/user/inlesson', async (req, res) => {
    let idLesson = req.query.idLesson;
    let idUser = req.query.idUser;

    try {
        await utilsAdmin.deleteUserFromList(idLesson, idUser);
        res.render('admin');
    } catch (err) {
        console.log(err);
        res.status(204).send('IMPOSSIBILE ELIMINARE UTENTE DALLA LEZIONE Errore = ' + err);
    }
});
module.exports = router;