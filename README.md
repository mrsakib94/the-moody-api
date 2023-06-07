<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# The Moody API Application

This is a NestJS application that serves paginated data from the Moody API. It ensures that there are no null or empty items in the response and maintains order. The application uses Axios for HTTP requests and node-cache for caching to make the response more reliable.

## Installation

```bash
$ npm install
```

## Running the app
1. Set the environment variables in .env file from .env-example
```bash

CACHE_TTL: The time-to-live for the cache.
MOODY_API_BASE_URI: The base URL of the Moody API.
MOODY_API_REQUEST_TIMEOUT: The timeout for the Moody API request.
MOODY_API_RETRY_COUNT: The maximum retry count for the Moody API.
PORT : Set the port number of The Moody API Application

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

