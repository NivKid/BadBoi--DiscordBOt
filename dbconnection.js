const Promise = require('bluebird');
const initOptions = {
    promiseLib: Promise
};
const pgp = require('pg-promise')(initOptions);
const cn = {
    host: 'ec2-54-83-59-144.compute-1.amazonaws.com',
    port: 5432,
    database: 'd82tr3ek72ea3i',
    user: 'dhemludtjdvmdr',
    password: '5334c55c7bffab153aac4875d58a5faa15036c1ec443f33d7961a278788db93b'
};

// const localdbConnection = {
//     host: 'localhost',
//     port: 5432,
//     database: 'chatapp',
//     user: 'postgres',
//     password: ''
// };

console.log('Connecting to DB')
const db = pgp(cn);

module.exports = {
    db,
};