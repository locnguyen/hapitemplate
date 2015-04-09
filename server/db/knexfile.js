module.exports = {
    development: {
        debug: true,
        client: 'pg',
        seeds: {
            directory: path.join(__dirname, 'seeds')
        },
        migrations: {
            directory: path.join(__dirname, 'migrations')
        },
        connection: {
            host: '127.0.0.1',
            username: 'vagrant',
            password: 'vagrant',
            database: ''
        }
    }
};
