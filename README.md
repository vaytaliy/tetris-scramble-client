# tetris-scramble-server

### Required one-time action:
- Install PostgresDB (and pgadmin) if you haven't already.
- Make sure you can run `psql` command in cmd or any other CLI.
- Create own user and database if necessary, make sure your user has write/read permissions.

### (Optional) Local database set up shortcut:
- You can create own user and database, but you'll need to manually create and edit `.env` files in server and client folders. To make set things up faster create new user `tetris-admin` with a command:
```
psql -U postgres
CREATE USER tetris_admin WITH PASSWORD '123' CREATEDB;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tetris_admin;
CREATE DATABASE tetris_scramble_dev;
Done. Go back with ctrl+c;
```
Optional: test if your database works and you have permissions to read/write:

```
psql -U tetris_admin tetris_scramble_dev
\l
CREATE TABLE test (test_col VARCHAR);
INSER INTO test_table VALUES('boom');
SELECT * FROM test_table;
DROP TABLE test_table;
```

## Development:
### If you've taken the shortcut:
Go to root directory and run commands:

`npm run setup` - installs packages for client and server
`npm run dev` - sets default parameters for environment variables package.json in server

### Without shortcut:
If you use another DB and/or another user then do the following:
- Create `.env` file in root server's folder if you haven't one.
- Add connection string corresponding to your DB and user
```
DATABASE_URL = <database-connection-string>
```
   - Example of database connectionstring: 
   `postgres://user:pass@localhost:5432/dbname`

To the same file add the following information:
```
JWT_SECRET = <unique-string>
```

Add an .env file directly below the `client` folder and fill it with the following information:
```
REACT_APP_API_BASE_ADDRESS=http://localhost:8079
```
Run setup command:

`npm run setup`

## Keep local database up-to date

- Install sequelize CLI using `npm install -g sequelize-cli`.
- Perform `npm install` (or make sure you have node_modules folder on the server)
- Add database string .env in root server directory like so:
```
DATABASE_URL = <database-connection-string>
```
- Run `sequelize db:migrate` to apply the latest database changes.
- To run the nodeJS server, use `npm start` or debug using VS Code.
- For the front-end, enter `npm run dev`.