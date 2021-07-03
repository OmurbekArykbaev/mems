# mems

**mems** is a simple Twitter clone

## Required Software

* Node.js (>= v16.3.0)
* npm (>= 7.17.0)
* MySQL (>= 8.0.25)

## Inital Setup

1. Create an `.env`. Inside the
file specify the following

```
# DB Params

DB_HOST=localhost # database location
DB_PORT=3306      # database port
DB_USER=?         # name of the database user
DB_PASS=?         # password of that user
DB_NAME=?         # name of the database itself
DB_DIALECT=?      # SQL dialect (mysql, mariadb, postgres, mssql)
```

2. Download and install npm libraries

```
npm install
```

3. Start the server

```
npm start
```

## Credits

Omurbek Arykabev <firefoxer00@gmail.com>