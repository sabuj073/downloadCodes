import pkg from 'mysql';
const {createPool} = pkg;
var db = createPool({
   host: "localhost",
   user: "root",
   password: "!@#chillhall#@!",
   database: "chillhall"
})

//var db = createPool({
//    host: "localhost",
//    user: "root",
//    password: "",
//    database: "chillhall"
//})

export default db;
