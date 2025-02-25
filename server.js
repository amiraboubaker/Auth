//mongodb
require('./config/db');

const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

const UserRouter = require('./api/User');
app.use('/user', UserRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});