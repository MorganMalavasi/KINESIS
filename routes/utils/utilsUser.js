const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://morgan:admin@musickinesis-x2kkv.mongodb.net/test?retryWrites=true&w=majority";

async function insertUser(firstname, lastname, mail, password, cel) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const user = { firstname: firstname, lastname: lastname, mail: mail, password: password, cel: cel, lessons: []};
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collection = client.db('PRENOTATIONS').collection('Users');
                try {
                    let exists = await collection.findOne({ 'mail': mail });
                    if (!exists) {
                        // hash password and return 
                        collection.insertOne(user, (error, response) => {
                            if (error) {
                                client.close();
                                reject('Error entering element');
                            } else {
                                client.close();
                                resolve(1);
                            }
                        });
                    } else {
                        client.close();
                        console.log('Username già esistente');
                        resolve(2);
                    }
                } catch (err) {
                    client.close();
                    reject('Error entering element');
                }
            }
        });
    });
}

function recoverUser(username) {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collection = client.db('PRENOTATIONS').collection('Users');
                collection.findOne({ 'username': username }, async (err, result) => {
                    if (err) {
                        client.close();
                        reject('Error looking for the user');
                    } else {
                        if (result == null) {
                            client.close();
                            reject('username incorretto, riprova');
                        } else {
                            client.close();
                            resolve(result._id);
                        }
                    }
                });
            }
        })
    });
}


module.exports = { insertUser, recoverUser };