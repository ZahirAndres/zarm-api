export const mysqlProvider = [{
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            port: process.env.MYSQL_PORT || '3306',
            user: process.env.MYSQL_USER || 'admin',
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE || 'bgma_db',
        })
        return connection;
    }
}];