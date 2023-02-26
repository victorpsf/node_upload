exports.RandomNumber = (min = 0, max = 0) => Math.floor(Math.random() * ((max - min + 1) + min));

exports.Guid = () => {
    const parts = [
        [0,0,0,0].map(a => this.RandomNumber(0, 255)).map(a => (`000${a.toString(16)}`).slice(-2)),
        [0,0].map(a => this.RandomNumber(0, 255)).map(a => (`000${a.toString(16)}`).slice(-2)),
        [0,0].map(a => this.RandomNumber(0, 255)).map(a => (`000${a.toString(16)}`).slice(-2)),
        [0,0].map(a => this.RandomNumber(0, 255)).map(a => (`000${a.toString(16)}`).slice(-2)),
        [0,0,0,0,0,0].map(a => this.RandomNumber(0, 255)).map(a => (`000${a.toString(16)}`).slice(-2))
    ];

    return parts.map(a => a.join('')).join('-').toUpperCase();
}