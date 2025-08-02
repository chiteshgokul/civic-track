const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const configureMiddleware = (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = { configureMiddleware };