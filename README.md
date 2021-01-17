# tetris-scramble-server


## Development:

Create an `.env` file and fill it with the following information:
```
DATABASE_URL = <database-connection-string>
JWT_SECRET = <unique-string>
```

Add an .env file directly below the `client` folder and fill it with the following information:
```
REACT_APP_API_BASE_ADDRESS=http://localhost:8079
```

Outside of that:
- Install PostgresDB (and pgadmin) if you haven't already.
- Set up environment variables above to connect to the database and API.
   - Example of database connectionstring: 
   `postgres://user:pass@localhost:5432/dbname`

- Install sequelize CLI using `npm install -g sequelize-cli`.
- Perform `npm install`.
- Run `sequelize db:migrate` to apply the latest database changes.
- To run the nodeJS server, use `npm start` or debug using VS Code.
- For the front-end, enter `npm run dev`.
