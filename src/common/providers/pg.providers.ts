export const pgProvider = [{
    provide: 'PG_CONNECTION',
    useFactory: async () => {
        const { Client } = require('pg');
        const client = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'linux2024',
            database: 'bgma_db',
        })
        await client.connect();
        return client;
    }
}];
