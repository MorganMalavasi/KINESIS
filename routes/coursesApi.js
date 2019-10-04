const express = require('express');
const router = express.Router();
const utilsCourses = require('./utils/utilsCourses');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// need to return a json with all the informations on the lessons you can get 
router.get('/', async (req, res) => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    try {
        let courses = await utilsCourses.getCourses(today);
        let coursesJson = JSON.stringify(courses);
        res.send(coursesJson);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.get('/prenotations', async (req, res) => {

    let name = req.query.name;
    let idUser = req.query.user;
    let id = req.query.id;
    let seats = req.query.seats;

    try {
        let bLesson = await utilsCourses.bookLesson(idUser, id, seats);
        if (bLesson == 1) {
            res.render('mainUserPage', {
                msg: "Lezione Prenotata",
                name: name,
                user: idUser
            });
        } else if (bLesson == 2) {
            res.render('mainUserPage', {
                msg: "Impossibile prenotare lezione, non ci sono più posti",
                name: name,
                user: idUser
            });
        } else if (bLesson == 3) {
            res.render('mainUserPage', {
                msg: "Ti sei già prenotato alla seguente lezione!",
                name: name,
                user: idUser
            });
        }
    } catch (err) {
        console.log(err);
        res.render('mainUserPage', {
            msg: "Impossibile prenotare lezione, errore = " + err,
            name: name,
            user: idUser
        });
    }
});

router.get('/view', async (req, res) => {
    let idUser = req.query.user;

    try {
        let lessonsBooked = await utilsCourses.lessonsBooked(idUser);
        let lessonsBookedJson = JSON.stringify(lessonsBooked);
        res.send(lessonsBookedJson);
    } catch (err) {
        console.log(err);
        res.send({});
    }
});

router.get('/delete', async (req, res) => {
    let idUser = req.query.user;
    let idLesson = req.query.idLesson;
    let name = req.query.name;

    try {
        await utilsCourses.deleteLesson(idUser, idLesson);
        res.render('mainUserPage', {
            msg: 'Lezione cancellata correttamente',
            name: name,
            user: idUser
        });
    } catch (err) {
        console.log(err);
        res.render('mainUserPage', {
            msg: 'Non è stato possibile cancellarti dalla lezione per un errore tecnico, chiama 3313216669',
            name: name,
            user: idUser
        });
    }
});

module.exports = router;