import express from 'express';
const app = express();
const PORT = 3000;

import auth from './routes/auth.js';

// Middleware to parse JSON body
app.use(express.json());

app.use('/', auth);

let server = app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

export {
    app,
    server,
};