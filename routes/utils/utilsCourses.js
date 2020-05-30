const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://morgan:admin@musickinesis-x2kkv.mongodb.net/test?retryWrites=true&w=majority";

async function getCourses(day) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                let allLessons = [];
                collectionLessons.find().forEach(async function (l) {
                    const diff = await differenceInDays(day, l.day);
                    if (diff)
                        allLessons.push(l);
                }).then(() => {
                    client.close();
                    resolve(allLessons);
                });
            }
        });
    });
}


function bookLesson(idUser, id, seats) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        if (seats <= 0) {
            resolve(2);
        } else {
            client.connect(async function (err) {
                if (err) {
                    reject(err);
                } else {
                    const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                    const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                    let elem = await collectionLessons.findOne({ "_id": ObjectId(id) });

                    // se nella lezione cercata non c'è l'id dell'utente allora posso inserirlo
                    if (!(elem.users).includes(idUser)) {
                        try {
                            // inserimento nella collezione delle lezioni 
                            let newSeats = seats - 1;
                            let findL = { "_id": ObjectId(id) };
                            let updateL = { $set: { "seats": newSeats }, $push: { "users": idUser } };
                            await collectionLessons.updateOne(findL, updateL);

                            // inserimento nella collezione degli utenti
                            let findU = { "_id": ObjectId(idUser) };
                            let updateU = { $push: { "lessons": id } };
                            await collectionUsers.updateOne(findU, updateU);

                            client.close();
                            resolve(1);
                        } catch (err) {
                            client.close();
                            console.log(err);
                            reject(err);
                        }
                    } else {
                        // se l'utente è già registrato alla lezione, non può registrarsi nuovamente 
                        client.close();
                        resolve(3);
                    }
                }
            });
        }
    });
}

function lessonsBooked(idUser, today) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject(err);
            } else {
                try {
                    let stackOfLessonsBooked = [];
                    const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                    const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                    let user = await collectionUsers.findOne({ "_id": ObjectId(idUser) });

                    // ottenuto l'utente ciclo su tutte le lezioni e creo un json di elementi delle lezioni
                    // prenotate con tutte le informazioni di ogni lezione

                    // TODO : aggiungere eliminazione delle vecchie lezioni 
                    //        oppure non leggere le lezioni che sono già state fatte 

                    if ((user.lessons).length == 0) {
                        client.close();
                        resolve(stackOfLessonsBooked);
                    } else {
                        (user.lessons).forEach(async function (elem, idx, array) {
                            let lesson = await collectionLessons.findOne({ "_id": ObjectId(elem) });
                            await insertElementInStack(lesson, today, stackOfLessonsBooked);
                            if (idx == array.length - 1) {
                                client.close();
                                resolve(stackOfLessonsBooked);
                            }
                        });
                    }
                } catch (err) {
                    client.close();
                    reject(err);
                }

            }
        });
    });
}

function deleteLesson(idUser, idLesson) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject(err);
            } else {
                try {
                    const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                    const collectionLessons = client.db('PRENOTATIONS').collection('lessons');

                    // cancellare la lezione dalle lezioni dell'utente.
                    let findU = { "_id": ObjectId(idUser) };
                    let updateU = { $pull: { "lessons": idLesson } };
                    await collectionUsers.updateOne(findU, updateU);

                    // cancellare utente dalla lista nelle lezioni e aumentare di 1 i posti
                    let foundLesson = await collectionLessons.findOne({ "_id": ObjectId(idLesson) });
                    if (foundLesson && (foundLesson.users).includes(idUser)) {
                        let seats = foundLesson.seats;
                        let newSeats = seats + 1;
                        let findL = { "_id": ObjectId(idLesson) };
                        let updateL = { $set: { "seats": newSeats }, $pull: { "users": idUser } };
                        await collectionLessons.updateOne(findL, updateL);
                        client.close();
                        resolve();
                    } else {
                        client.close();
                        resolve();
                    }
                } catch (err) {
                    client.close();
                    reject(err);
                }
            }
        });
    });
}



//////////////////////////////////// function support ////////////////////////////////////
function insertElementInStack(lesson, today, stackOfLessonsBooked) {
    return new Promise(async (resolve, reject) => {
        if (lesson) {
            // verifica che la prenotazione riguardi una prenotazione che deve ancora avvenire 
            let check = await differenceInDaysToRetrieve(today, lesson.day);
            if (check) {          
                let id_lesson = lesson._id;                                     
                let name = lesson.name;
                let day = lesson.day;
                let time = lesson.time;
                let people = lesson.users;
                const obj = { id_lesson: id_lesson, name: name, day: day, time: time, users: people };
                stackOfLessonsBooked.push(obj);
                resolve();
            } else {
                resolve();
            }
        } else {
            resolve();
        }
    });
}

function differenceInDays(d1, d2) {
    return new Promise((resolve, reject) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const diffTime = date2 - date1;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 8)
            resolve(true);
        else
            resolve(false);
    });
}

function differenceInDaysToRetrieve(d1, d2) {
    return new Promise((resolve, reject) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const diffTime = date2 - date1;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0){
            resolve(true);
            console.log(diffDays);
        }
        else
            resolve(false);
    });
}


module.exports = { getCourses, bookLesson, lessonsBooked, deleteLesson };