// play this: https://www.youtube.com/watch?v=d-diB65scQU

// code away!
require('dotenv').config();

const server = require('./server.js');

server.listen(8888, () => {
    console.log(`'\n*** Server Running on http://localhost:8888 ***\n'`);
});