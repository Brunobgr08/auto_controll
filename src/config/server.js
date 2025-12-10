const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('../middlewares/errorHandler');
const notFoundHandler = require('../middlewares/notFoundHandler');

const routes = require('../routes');
const { swaggerUi, specs } = require('../swagger');

const configureServer = () => {
  const app = express();

  // Middlewares básicos
  app.use(helmet()); // Segurança HTTP
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // API Routes
  app.use('/api', routes);

  // 404 Handler
  app.use(notFoundHandler);

  // Error Handler
  app.use(errorHandler);

  return app;
};

module.exports = configureServer;
