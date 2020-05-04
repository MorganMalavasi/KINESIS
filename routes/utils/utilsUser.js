const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://morgan:admin@musickinesis-x2kkv.mongodb.net/test?retryWrites=true&w=majority";
var bcrypt = require('bcryptjs');

async function insertUser(firstname, lastname, mail, password, cel) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
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
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(password, salt, function (err, hash) {
                                const user = { firstname: firstname, lastname: lastname, mail: mail, password: hash, cel: cel, lessons: [] };
                                collection.insertOne(user, (error, response) => {
                                    if (error) {
                                        client.close();
                                        reject('Error entering element');
                                    } else {
                                        client.close();
                                        resolve(1);
                                    }
                                });
                            });
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

function recoverUser(mail, password) {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(function (err) {
            if (err) {
                reject('Error loading DB');
            } else {
                const collection = client.db('PRENOTATIONS').collection('Users');

                collection.findOne({ 'mail': mail }, async (err, result) => {
                    if (err) {
                        client.close();
                        reject('Error looking for the user');
                    } else {
                        // mail non esistente
                        if (result == null) {
                            client.close();
                            reject('mail inesistente, riprova');
                        } else {
                            bcrypt.compare(password, result.password, function (err, res) {
                                if (err) {
                                    client.close();
                                    reject('Error retrieving password');
                                } else {
                                    if (res == true) {
                                        client.close();
                                        resolve([result._id, result.firstname]);
                                    } else {
                                        client.close();
                                        reject('password errata, riprova');
                                    }
                                }
                            });
                        }
                    }
                });
            }
        })
    });
}


module.exports = { insertUser, recoverUser };