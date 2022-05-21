const express = require('express');
require ('./db/mongoose')
const encodeRouter = require('./routers/encodeRouter');
const decodeRouter = require('./routers/decodeRouter');
const commonRouters = require('./routers/commonRouters')

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(encodeRouter);
app.use(decodeRouter);
app.use(commonRouters);


app.listen(port, () => {
    console.log('Server is up on port: ' + port);
})