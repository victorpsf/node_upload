const express = require('express');

const upload = require('./upload');

const routes = {
    upload
}

module.exports = function (app = express()) {
    for (const route in routes) app.use(`/${route}`, routes[route]);
}