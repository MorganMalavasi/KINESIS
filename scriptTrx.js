var start = new Date("09/27/2019");
var end = new Date("06/16/2020");

var loop = new Date(start);

while(loop <= end){
    let dd = String(loop.getDate()).substr(0,2);
    let mm = String(loop.getMonth() + 1).substr(0,2); //January is 0!
    let yyyy = loop.getFullYear();
    let date = mm + '/' + dd + '/' + yyyy;
    
    // sunday = 0 , monday = 1 ,......  
   if (loop.getDay() == 5){
       db.getCollection('lessons').insertOne({'name': 'TOTAL BODY', 'uuid': '5e0f0b3a5a971f52676a3f90', 'seats': 20, 'users':[], 'day': date, 'time':'12:50'});
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