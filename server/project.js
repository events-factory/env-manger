const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = require('./authMiddleware');

const router = express.Router();

const tokenBlacklist = new Set();

router.post('/', authMiddleware, async (req, res) => {
  const projectName = req.body.projectName;
  const projectPath = path.join(__dirname, '..', 'projects', projectName);

  try {
    await fs.mkdir(projectPath);
    res.status(201).json({
      message: 'Project created successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating project.'
    });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const projectNames = await fs.readdir(path.join(__dirname, '..', 'projects'));
    const projects = projectNames.map(name => ({
      name
    }));
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching projects.'
    });
  }
});

router.post('/:projectName/env', authMiddleware, async (req, res) => {
  const projectName = req.params.projectName;
  const projectPath = path.join(__dirname, '..', 'projects', projectName);
  const envFilePath = path.join(projectPath, '.env');

  try {
    await fs.mkdir(projectPath, {
      recursive: true
    });
    await fs.writeFile(envFilePath, '');
    res.status(201).json({
      message: '.env file created successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating .env file.'
    });
  }
});

router.get('/:projectName/env', authMiddleware, async (req, res) => {
  const projectName = req.params.projectName;
  const projectPath = path.join(__dirname, '..', 'projects', projectName);
  const envFilePath = path.join(projectPath, '.env');

  try {
    try {
      await fs.access(envFilePath);
      const envContent = await fs.readFile(envFilePath, 'utf-8');
      res.status(200).send(envContent);
    } catch (error) {
      res.status(404).json({
        message: '.env file not found.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred.'
    });
  }
});

router.put('/:projectName/env', authMiddleware, async (req, res) => {
  const projectName = req.params.projectName;
  const projectPath = path.join(__dirname, '..', 'projects', projectName);
  const envFilePath = path.join(projectPath, '.env');
  const updatedEnvContent = req.body.envContent;

  try {
    await fs.mkdir(projectPath, {
      recursive: true
    });
    await fs.writeFile(envFilePath, updatedEnvContent);
    res.status(200).json({
      message: '.env file updated successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating .env file.'
    });
  }
});


router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const users = JSON.parse(await fs.readFile(path.resolve(__dirname, '..', 'database', 'users.json'), 'utf-8'));
    if (!users) {
      res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    const user = users.find(user => user.username === username);

    if (!user) {
      res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   res.status(401).json({
    //     message: 'Invalid credentials.'
    //   });
    // }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(401).json({
          message: 'Invalid credentials.'
        });
      }

      if (!result) {
        res.status(401).json({
          message: 'Invalid credentials.'
        });
      }
    });

    const token = jwt.sign({
      user: {
        username: user.username
      }
    }, process.env.SECRET_KEY, {
      expiresIn: '1h'
    });

    res.status(200).json({
      message: 'Login successful.',
      username: user.username,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred during login.'
    });
  }
});

router.post('/logout', authMiddleware,(req, res) => {
    res.sendStatus(200);
});

module.exports = router;