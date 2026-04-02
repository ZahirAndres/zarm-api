export const pgProvider = [{
    provide: 'PG_CONNECTION',
    useFactory: async () => {
        const { Client } = require('pg');
        const client = new Client({
            host: process.env.PG_HOST || 'localhost',
            port: parseInt(process.env.PG_PORT || '5432'),
            user: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE || 'bgma_db',
        })
        await client.connect();
        return client;
    }
}];
