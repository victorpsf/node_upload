const { Router, request, response } = require('express')
const fs = require('fs');
const { Guid } = require('../source/util')
const route = Router();
const path = require('path');
const crypto = require('crypto')

route.get('/', async (req = request, res = response) => {
    let guid = '';
    if (!req.query.type) {
        res.status(400);
        res.json({ error: 'type not informed' });
        return res.end();
    }
    
    do {
        guid = Guid();
    } while (req.cache.get(guid) != null);
    const _path = path.join(req._path, 'public/doc/', req.query.type.split('/')[0]);
    
    if (!fs.existsSync(_path)) fs.mkdirSync(_path, { recursive: true });
    const opt = {
        path: path.join(_path, guid),
        stream: null
    };

    opt.stream = fs.createWriteStream(opt.path)
    req.cache.set(guid, opt);

    res.json({ uuid: guid });
    res.status(200);
    res.end();
});

const appendBuffer = function ({ size, totalSize, buffer, verify }, req, UUID, stream = fs.createWriteStream('')) {
    if (crypto.createHash('sha512').update(Buffer.from(buffer)).digest('hex').toUpperCase() != verify)
        throw 'buffer not loaded';
    stream.write(Buffer.from(buffer).toString('base64'), 'base64');
    if (size >= totalSize) {
        stream.end();
        req.cache.unset(UUID);
    };
}

route.post('/', async (req = request, res = response) => {
    const { uuid, content } = req.body

    if (!uuid || req.cache.get(uuid) == null) {
        res.status(400);
        res.json({ error: 'uuid is not informed' });
        return res.end();
    }

    try {
        appendBuffer(
            content, 
            req, 
            uuid, 
            req.cache.get(uuid).stream
        );
    }

    catch (error) {
        console.error('ERROR STREAM ::', error);
        res.status(400);
        return res.end();
    }

    res.status(200);
    res.end();
});

module.exports = route;