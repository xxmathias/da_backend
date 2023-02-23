

import * as mysql from 'mysql2';

const connection = mysql.createConnection({
    host: '100.103.227.61',
    user: 'diplom',
    password: 'password',
    database: 'test'
});


export default connection;