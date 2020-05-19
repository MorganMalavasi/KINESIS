var start = new Date("05/11/2020");
var end = new Date("08/31/2020");

var loop = new Date(start);

while(loop <= end){
    let dd = String(loop.getDate()).substr(0,2);
    let mm = String(loop.getMonth() + 1).substr(0,2); //January is 0!
    let yyyy = loop.getFullYear();
    let date = mm + '/' + dd + '/' + yyyy;
    
    // sunday = 0 , monday = 1 ,......  
   if (loop.getDay() == 1 || loop.getDay() == 3 || loop.getDay() == 5){
       db.getCollection('lessons').insertOne({'name': 'FASCIA ORARIA 18:30/21:00', 'uuid': '5ebd6a3e61e7ac7ff79a2c0d', 'seats': 20, 'users':[], 'day': date, 'time':'18:30/21:00'});
   }
   var newDate = loop.setDate(loop.getDate() + 1);
   loop = new Date(newDate);
}

/*
function chooseDay (day) {
    return new Promise((resolve, reject) => {
        if (day == 3){
            db.getCollection('lessons').insertOne({'name': 'trx', 'uuid': '5d93a592be3b769b0f93604a', seats: 15, users:[], 'day': loop, 'time':'19:00'});
            resolve();
        } else if (day == 4) {
            db.getCollection('lessons').insertOne({'name': 'trx', 'uuid': '5d93a592be3b769b0f93604a', seats: 15, users:[], 'day': loop, 'time':'19:30'});
            resolve();
        } else if (day == 5) {
            db.getCollection('lessons').insertOne({'name': 'trx', 'uuid': '5d93a592be3b769b0f93604a', seats: 15, users:[], 'day': loop, 'time':'19:00'});
            resolve();
        } else {
            resolve();
        }
    });
}
*/