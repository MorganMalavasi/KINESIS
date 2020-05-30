var start = new Date("06/01/2020");
var end = new Date("08/31/2020");

var loop = new Date(start);

while(loop <= end){
    let dd = String(loop.getDate()).substr(0,2);
    let mm = String(loop.getMonth() + 1).substr(0,2); //January is 0!
    let yyyy = loop.getFullYear();
    let date = mm + '/' + dd + '/' + yyyy;
    
    // sunday = 0 , monday = 1 ,......  
   if (loop.getDay() == 1){
       db.getCollection('lessons').insertOne({'name': 'SALA/PALESTRA', 'uuid': '5ec535a78a8315bd36ad973b', 'seats': 25, 'users':[], 'day': date, 'time':'16:00/18:00'});
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