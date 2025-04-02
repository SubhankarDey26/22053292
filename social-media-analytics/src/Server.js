const app = require('./app');
const config = require('./config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Social Media Analytics API server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});