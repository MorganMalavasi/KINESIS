const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://morgan:admin@musickinesis-x2kkv.mongodb.net/test?retryWrites=true&w=majority";

async function insertUser(firstname, lastname, username, cel) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const user = { firstname: firstname, lastname: lastname, username: username, cel: cel};
    return new Promise((resolve, reject) => {
        client.connect(async function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collection = client.db('PRENOTATIONS').collection('Users');
                try {
                    let exists = await collection.findOne({ 'username': username });
                    if (!exists) {
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
                            reject('username incorretto, riprova');
                        } else {
                            client.close();
                            resolve(true);
                        }
                    }
                });
            }
        })
    });
}


module.exports = { insertUser, recoverUser };