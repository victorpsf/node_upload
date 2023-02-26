const express = require('express') 
const path = require('path')

module.exports = function (mainPath = '', app = express()) {
    app.use('/', express.static(path.join(mainPath, 'public/html')));
    app.use('/js', express.static(path.join(mainPath, 'public/js')));
    app.use('/documents', express.static(path.join(mainPath, 'public/doc')));
}