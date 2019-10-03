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

function differenceInDays(d1, d2) {
    return new Promise((resolve, reject) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const diffTime = date2 - date1;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7)
            resolve(true);
        else
            resolve(false);
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
                    let elem = await collectionLessons.findOne({ "_id": ObjectId(id) });
                    // se nella lezione cercata non c'è l'id dell'utente allora posso inserirlo
                    if (!(elem.users).includes(idUser)) {
                        // inserimento nella collezione delle lezioni 
                        let newSeats = seats - 1;
                        let find = { "_id": ObjectId(id) };
                        let update = { $set: { "seats": newSeats }, $push: { "users": idUser } };
                        collectionLessons.updateOne(find, update, (err, res) => {
                            if (err) {
                                client.close();
                                reject(err);
                            } else {
                                client.close();
                                resolve(1);
                            }
                        });
                        // inserimento nella collezione dell'utente 
                        
                    
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




module.exports = { getCourses, bookLesson };