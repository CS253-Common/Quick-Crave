# Quick_Crave

## Backend

### Setup Instructions

1. Install the PostgreSQL package for your OS from [here](https://www.postgresql.org/download/)
2. Install Postman for API testing from [here](https://www.postman.com/downloads/)
3. Create a project directory having the subdirectories "database" and "server"
4. Run `initdb -D <path/to/database>` to initialise database cluster
5. Run `pg_ctl -D <path/to/database> start`
6. Run `psql -U <username> -d <database>` to connect to database interactively
7. Start the server using, `node server.js`
8. Test the requests using Postman
9. Run  `pg_ctl -D <path/to/database> stop`

#### NOTE: We are doing all the testing locally for now. Final system testing is to be done after 28th March

### TODO

1. Decide on the class templates
2. Do light-weight implementations

## Frontend

### TODO

1. Design and create pages for ordering, recommendations, final checkout & menus of the side bar for cutomers
2. Design and create the missing pages for Canteen Manager
3. Add the URLs for the HTTPS requests 
