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
        res.send(coursesJson);
    }
});

module.exports = router;