const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../public'), { 'extensions': ['html', 'htm', 'css'] }));

app.use(bodyParser.json());

const projectsRouter = require('./project');
app.use('/api/project', projectsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});