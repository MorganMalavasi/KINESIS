const MongoClient = require('mongodb').MongoClient;
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
        const diffTime = date2-date1;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7)
            resolve(true);
        else
            resolve(false);
    });
}





module.exports = { getCourses };