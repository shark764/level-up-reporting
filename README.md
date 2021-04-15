# Level Up - Reporting Server

Server made with Javascript technologies to provide realtime data
Will capture messages from Game Controller Server and send results to Web BFF and Mobile BFF.

## Installation

This project requires [Node.js](https://nodejs.org/) v14+ to run.

Using .nvmrc file helps to normalize node version used by all maintainers.
If you are required to use version specified in this file, run these commands.

```bash
nvm use
nvm install
```

Use the package manager [npm](https://www.npmjs.com/get-npm) v6+ to install dependencies and devDependencies.

```bash
npm install
```
## Usage

Create a `.env` file with the following content

```bash
NODE_ENV=development
PORT=9000
SOCKET_IO_PORT=9001
MONGODB_URI=mongodb://localhost:27017/your_local_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

If you are using a local [MongoDB](https://docs.mongodb.com/manual/installation/) database, start the **mongod** service

```bash
sudo service mongod start
```

If you using a local [Redis](https://redis.io/topics/quickstart) server, start **redis-server** service and confirm that is running

```bash
sudo service redis-server start
redis-cli
```

If you are having troubles with redis, check this [guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)

**Run server**

```bash
npm run dev
```

Open Graphql Playground

```bash
http://localhost:${PORT}/reporting-bff-graphql
```
Example: [http://localhost:9000/reporting-bff-graphql](http://localhost:9000/reporting-bff-graphql)

## Utilities

Format code using [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/)

```bash
npm run prettify
```

## Tech Stack
- [NodeJs](https://nodejs.org/es/)
- [ExpressJs](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Apollo Graphql](https://www.apollographql.com/)
- [Socket.IO](https://socket.io/)
- [Redis](https://redis.io/topics/quickstart)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](https://opensource.org/licenses/ISC)