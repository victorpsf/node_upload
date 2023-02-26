const mainPath = require.main.path;
const express = require('express');
const http = require('http');
const publicPaths = require('./source/public')
const cache = require('./source/cache')
const routes = require('./route')
const requestReader = require('./source/reader')

const app = express();
const appCache = new cache();

requestReader(app);
app.use((req, res, next) => {
    req._path = mainPath;
    req.cache = appCache;
    next();
})

publicPaths(mainPath, app);
const server = http.createServer(app);
routes(app);

server.listen(
    3000, 
    () => console.log('server open in http://localhost:3000/')
);