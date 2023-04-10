const express = require('express');
const app = express();
const PORT = 3000;

const auth = require('./routes/auth');

// Middleware to parse JSON body
app.use(express.json());

app.use('/', auth);

let server = app.listen(PORT, () => console.log(`App listening on port ${PORT}`));


module.exports = {
    app,
    server,
};