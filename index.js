const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { login, register, getUser, editUser, deleteUser } = require('./modules');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', async(req, res) => {
    const response = await login(req.body);
    res.status(response.status).send(response);
});

app.post('/register', async(req, res) => {
    const response = await register(req.body);
    res.status(response.status).send(response);
})

app.get('/user', async(req, res) => {
    const response = await getUser(req.body);
    res.status(response.status).send(response);
});

app.put('/user', async(req, res) => {
    const response = await editUser(req.body);
    res.status(response.status).send(response);
});

app.delete('/user', async(req, res) => {
    const response = await deleteUser(req.body);
    res.status(response.status).send(response);
});

app.listen(3000, () => {
    console.log('Server Run on port 3000');
})