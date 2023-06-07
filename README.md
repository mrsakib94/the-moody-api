<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Till Pay By Link

Till Pay By Link to serve the merchants and customers to create and manage payment requests, transactions and team members.
Till Pay By Link helps to create payment URL for Till HPP.

## Installation

```bash
$ yarn install
```

## Running the app
1. Set the environment variables in .env file from .env-example
```bash

DB_HOST : Host name of the database
DB_PORT : Port number of the database
DB_USERNAME : database username
DB_PASSWORD : databse password
DB_DATABASE : database name
DB_NAME : TODO
ENV : Service environment (default = DEVELOPMENT) 

PORT : Set the port number of Till Pay By Link application

AWS_PUBLIC_FOLDER : AWS S3 public storage location
AWS_PRIVATE_FOLDER : AWS S3 private storage location

```
2. Set the NPM_TOKEN
```bash

$ export NPM_TOKEN=your-token
```
*Note this token is generated from our NPM account, one will need to be generated that is unique to yourself.*

3. Set the AWS config
```bash

$ export AWS_ACCESS_KEY_ID="Your aws access key Id"
$ export AWS_SECRET_ACCESS_KEY="Your AWS secret access key"
$ export AWS_SESSION_TOKEN="Your session token"
```
*Note these values may be obtained from your awsapps login.*

4. Run Docker and set up the database
```bash
# To bring up your local database
$ docker-compose up

# To bring down your local database
$ docker-compose down
```

If you need to remove the volume linked to the database
```bash
# To get the name of the volume to remove
$ docker volume ls

$ docker volume rm <name of volume>
```

5. Start the server
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

