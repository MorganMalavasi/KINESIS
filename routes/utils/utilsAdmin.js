const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://morgan:admin@musickinesis-x2kkv.mongodb.net/test?retryWrites=true&w=majority";

function getlistUsers() {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                let stackUsers = [];
                collectionUsers.find({}).forEach((us) => {
                    stackUsers.push(us);
                }).then(() => {
                    client.close();
                    resolve(stackUsers);
                });

            }
        });
    });
}

function deleteUser(idUser) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                try {
                    // eliminare utente dal db + tutte le lezioni a cui è registrato
                    let user = await collectionUsers.findOne({ "_id": ObjectId(idUser) });
                    let stackLessonsOfUsers = [];

                    if (user) {
                        // se l'utente esiste nel db fai operazioni
                        await copyLessons(user, stackLessonsOfUsers);
                        await collectionUsers.deleteOne({ "_id": ObjectId(idUser) });

                        if (stackLessonsOfUsers.length > 0) {
                            stackLessonsOfUsers.forEach(async (idLesson, idx, arr) => {
                                let lesson = await collectionLessons.findOne({ "_id": ObjectId(idLesson) });
                                if (lesson) {
                                    let newSeats = lesson.seats + 1;
                                    let findL = { "_id": ObjectId(idLesson) };
                                    let updateL = { $set: { "seats": newSeats }, $pull: { "users": idUser } };
                                    await collectionLessons.updateOne(findL, updateL);
                                }
                                if (idx == (arr.length - 1)) {
                                    client.close();
                                    resolve();
                                }
                            });
                        } else {
                            client.close();
                            resolve();
                        }
                    } else {
                        // se l'utente non esiste ritorna 
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

function copyLessons(user, stack) {
    return new Promise((resolve, reject) => {
        if ((user.lessons).length > 0) {
            (user.lessons).forEach((elem, idx, arr) => {
                stack.push(elem);
                if (idx == (arr.length - 1))
                    resolve();
            });
        } else {
            resolve();
        }

    });
}

function getAllLessons() {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect((err) => {
            if (err) {
                reject('Error loading DB');
            } else {
                let stackLessons = [];
                const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                collectionLessons.find().forEach(async (elem) => {
                    // difference in days between today and the day from the array 
                    const diff = await differenceInDays(elem.day);
                    if (diff)
                        stackLessons.push(elem);
                }).then(() => {
                    client.close();
                    console.log(stackLessons);
                    resolve(stackLessons);
                });
            }
        });
    });
}

function deleteSingleLesson(idLesson) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                try {
                    // eliminare lezione dal db + tutte le ripetizioni per ogni utente
                    let lesson = await collectionLessons.findOne({ "_id": ObjectId(idLesson) });
                    let stackUsersOfLesson = [];

                    if (lesson) {
                        // se la lezione esiste nel db fai operazioni
                        await copyUsers(lesson, stackUsersOfLesson);
                        await collectionLessons.deleteOne({ "_id": ObjectId(idLesson) });

                        if (stackUsersOfLesson.length > 0) {
                            stackUsersOfLesson.forEach(async (idUser, idx, arr) => {
                                let user = await collectionUsers.findOne({ "_id": ObjectId(idUser) });
                                if (user) {
                                    let findU = { "_id": ObjectId(idUser) };
                                    let updateU = { $pull: { "lessons": idLesson } };
                                    await collectionUsers.updateOne(findU, updateU);
                                }
                                if (idx == (arr.length - 1)) {
                                    client.close();
                                    resolve();
                                }
                            });
                        } else {
                            client.close();
                            resolve();
                        }
                    } else {
                        // se la lezione non esiste ritorna 
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

function copyUsers(lesson, stack) {
    return new Promise((resolve, reject) => {
        if ((lesson.users).length > 0) {
            (lesson.users).forEach((elem, idx, arr) => {
                stack.push(elem);
                if (idx == (arr.length - 1))
                    resolve();
            });
        } else {
            resolve();
        }

    });
}

function getAllUsersOfLesson(idLesson) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async (err) => {
            if (err) {
                reject('Error loading DB');
            } else {
                // trova tutti gli utenti di una lezione e metti dentro uno stack 
                let stackUsersInLesson = [];
                const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                const collectionLessons = client.db('PRENOTATIONS').collection('lessons');
                let lesson = await collectionLessons.findOne({ "_id": ObjectId(idLesson) });
                if (lesson) {
                    if ((lesson.users).length > 0) {
                        (lesson.users).forEach(async (elem, idx, arr) => {
                            // per ogni id cerca l'utente associato e mettilo nello stack 
                            const user = await collectionUsers.findOne({ "_id": ObjectId(elem) });
                            if (user)
                                stackUsersInLesson.push(user);

                            if (idx == arr.length - 1) {
                                client.close();
                                resolve(stackUsersInLesson);
                            }
                        });
                    } else {
                        client.close();
                        resolve(stackUsersInLesson);
                    }

                } else {
                    client.close();
                    resolve(stackUsersInLesson);
                }
            }
        });
    });
}

function deleteUserFromList(idLesson, idUser) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        client.connect(async (err) => {
            if (err) {
                reject('Error loading DB');
            } else {
                const collectionUsers = client.db('PRENOTATIONS').collection('Users');
                const collectionLessons = client.db('PRENOTATIONS').collection('lessons');

                let lesson = await collectionLessons.findOne({ "_id": ObjectId(idLesson) });
                if (lesson) {
                    // delete user from list of the lesson
                    let newSeats = lesson.seats + 1;
                    let findL = { "_id": ObjectId(idLesson) };
                    let updateL = { $set: { "seats": newSeats }, $pull: { "users": idUser } };
                    await collectionLessons.updateOne(findL, updateL);

                    let user = await collectionUsers.findOne({ "_id": ObjectId(idUser) });
                    if (user) {
                        // delete lesson from list of the user 
                        let findU = { "_id": ObjectId(idUser) };
                        let updateU = { $pull: { "lessons": idLesson } };
                        await collectionUsers.updateOne(findU, updateU);
                        client.close();
                        resolve();
                    } else {
                        client.close();
                        resolve();
                    }
                } else {
                    client.close();
                    resolve();
                }
            }
        });
    });
}

function differenceInDays(dayFromArray) {
    return new Promise((resolve, reject) => {
        const date1 = new Date();
        const date2 = new Date(dayFromArray);
        const diffTime = date2 - date1;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7)
            resolve(true);
        else
            resolve(false);
    });
}



module.exports = { getlistUsers, deleteUser, getAllLessons, deleteSingleLesson, getAllUsersOfLesson, deleteUserFromList };