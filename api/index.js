const { createExpressApp } = require('../dist/app.factory.js');

module.exports = async function handler(req, res) {
  const app = await createExpressApp();
  return app(req, res);
};