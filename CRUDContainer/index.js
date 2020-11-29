const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { getUser, editUser, deleteUser } = require('./modules');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/user', async(req, res) => {
    const response = await getUser(req.headers);
    res.status(response.status).send(response);
});

app.put('/user', async(req, res) => {
    const response = await editUser(req.headers, req.body);
    res.status(response.status).send(response);
});

app.delete('/user', async(req, res) => {
    const response = await deleteUser(req.body);
    res.status(response.status).send(response);
});

app.listen(4000, () => {
    console.log('Server Run on port 4000');
})