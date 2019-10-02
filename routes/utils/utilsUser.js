const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://morgan:admin@musickinesis-x2kkv.mongodb.net/test?retryWrites=true&w=majority";
const bcrypt = require('bcrypt');

async function insertUser(firstname, lastname, username, cel, password) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { firstname: firstname, lastname: lastname, username: username, cel: cel, password: hashedPassword };
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
                        console.log('Element already Exists');
                        resolve(2);
                    }
                } catch (err) {
                    reject('Error entering element');
                }
            }
        });
    });
}

function recoverUser(username, password) {
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
                            try {
                                if (await bcrypt.compare(password, result.password)) {
                                    client.close();
                                    resolve(1);
                                }
                                else {
                                    client.close();
                                    resolve(2);
                                }
                            } catch (err) {
                                client.close();
                                reject(err);
                            }
                        }
                    }
                });
            }
        })
    });
}


module.exports = { insertUser, recoverUser };