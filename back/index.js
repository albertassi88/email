const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require("./src/services/mongoose");

const app = express();
const port = 19824;

app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

const userRoutes = require('./src/api/user/routes');

app.use('/user', userRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
