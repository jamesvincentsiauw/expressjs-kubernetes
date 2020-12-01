const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { login, register, verifyToken, registerAdmin } = require('./modules');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', async(req, res) => {
    const response = await login(req.body);
    res.status(response.status).send(response);
});

app.post('/register', async(req, res) => {
    const response = await register(req.headers, req.body);
    res.status(response.status).send(response);
})

app.post('/admin', async(req, res) => {
    const response = await registerAdmin();
    res.status(response.status).send(response);
})

app.post('/verifytoken', async(req, res) => {
    const response = await verifyToken(req.headers.accesstoken, req.body.permittedRole);
    res.status(response.status).send(response);
});

app.listen(3000, () => {
    console.log('Server Run on port 3000');
})