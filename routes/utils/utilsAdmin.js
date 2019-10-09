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
                collectionLessons.find({}).forEach((elem) => {
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

module.exports = { getlistUsers, deleteUser, getAllLessons };