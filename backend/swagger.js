const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); // Path to your swagger.yaml file

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
};


// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'ThiSo API',
//       version: '1.0.0',
//       description: 'API for ThiSo application',
//     },
//     servers: [
//       {
//         url: `http://localhost:${process.env.PORT || 3001}`,
//       },
//     ],
//   },
//   apis: ['./routers/*.js'],
// };

// const swaggerSpec = swaggerJSDoc(options);

// module.exports = {
//   swaggerUi,
//   swaggerSpec,
// };