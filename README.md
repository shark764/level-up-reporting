# Level Up - Reporting Server

Server made with Javascript technologies to provide realtime data
Will capture messages from Game Controller Server and send results to Web BFF and Mobile BFF.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install dependencies.

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

If you are using a local mongodb database, start the service

```bash
sudo service mongod start
```

If you using a local redis server, confirm that is running

```bash
redis cli
```
If you are having troubles with redis, check this [guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)

Run server

```bash
npm run dev
```

Open Graphql Playground

```bash
http://localhost:${PORT}/levelup-graphql
```
Example: [http://localhost:9000/levelup-graphql](http://localhost:9000/levelup-graphql)

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