const cache = {}

module.exports = function () {
    this.get = function (key = '') {
        return cache[key] || null;
    }

    this.set  = function (key = '', value) {
        cache[key] = value;
        return this.get(key);
    }

    this.unset = function (key = '') {
        if (cache[key]) delete cache[key];
    }

    return this;
}