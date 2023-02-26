const express = require('express');
const { request } = express
const urlModule = require('url')

const readQueryString = function (url) {
    try {
        const parsed = urlModule.parse(url, true);
        return Object.assign({}, parsed.query);
    }

    catch (error) {
        console.error('QUERY ERROR :: ', error);
        return {};
    }
}

const readBody = (req = request) => new Promise((resolve) => {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });
    
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            }
    
            catch (error) {
                console.error('BODY ERROR :: ', error);
                resolve({});
            }
        });
    } 
    
    catch (error) {
        console.log(error);
        return resolve({});
    }
});

module.exports = async (app = express()) => {
    app.use(async (req, res, next) => {
        req.query = readQueryString(req.url);
        req.body = await readBody(req);
        next();
    });
}