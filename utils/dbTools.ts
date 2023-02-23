import { User } from '../index.interface';
import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import connection from './database/database_con';

export const validateCredentials = async (user: User): Promise<boolean> => {
 
    const rows = await connection.execute('SELECT password from users WHERE email = ? AND password = ?', [user.email, user.password], (err, res)=>{console.log("RES: ", res.length); return res.length > 0})
    return false;
   
// needs fix
};
