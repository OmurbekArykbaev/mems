# mems

**mems** is a simple Twitter clone.

## Inital Manual Setup

### Required Software

* Node.js (>= v16.3.0)
* npm (>= 7.17.0)
* MySQL (>= 8.0.25)

### Steps

1. Create an `.env` file. Inside the file specify the following

```
# Server Params

MEMS_HOST=?             # IP or hostname of the HTTP/S server (default: localhost)
MEMS_PORT=?             # Port to run the server on (default: 8080)
MEMS_ADMIN_LOGIN=?      # Name of the administrator user (default: admin)
MEMS_ADMIN_PASS=?       # Password of the administrator user (required)
MEMS_PASS_SALT_ROUNDS=? # Number of rounds to use for hashing passwords (default: 8)
MEMS_SESSION_SECRET=?   # Session secret (required)
MEMS_RESTART_DELAY=?    # Delay in seconds before restarting the server on DB
                          connection error (default: 3)

# DB Params

DB_HOST=?    # Database location (default: localhost)
DB_PORT=?    # Database port (default: 3306)
DB_USER=?    # Name of the database user (default: mems_db_user)
DB_PASS=?    # Password of that user (required)
DB_NAME=?    # Name of the database itself (default: mems_db)
DB_DIALECT=? # SQL dialect (mysql, mariadb, postgres, mssql) (default: mysql)

# Session DB Params

SESS_DB_HOST=? # Database location (default: localhost)
SESS_DB_PORT=? # Database port (default: 6379)
SESS_DB_PASS=? # Password to the database (optional)
```

2. Download and install npm libraries.

```
npm install
```

3. Start the server.

```
npm start
```

## Inital Setup through Docker

### Required Software

* Docker (>= 20.10.7)

### Steps

1. Install Docker and Docker Compose.

2. Create an `.env` file as described in 'Inital Manual Setup'.

3. Start the system.

```
docker-compose up
```

To be able to modify files while the containers are running, start the system
with `docker-compose -f docker-compose.yml -f docker-compose.extra-dev.yml up`.
Ensure to run `npm install` locally before starting the development containers.
Ensure that the installed modules on your host OS are compatible with the OS
used by the Docker platform.

## Credits

Dmirii Toksaitov <dmitrii@toksaitov.com>
