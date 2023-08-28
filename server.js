/**
 * [IMPORTANT]
 *
 * This module controls the clustering of the application. Unless you are
 * customizing the start/stop logic (e.g. graceful shutdown), you *DO NOT* need
 * to modify this file most probably.
 *
 * You shall take a look at `app.js` to customize the application logic.
 */

// const log = require('./src/server/services/logger').child({ module: 'server' });

const port = process.env.NODE_PORT || 3000;

require('dotenv').config();

// require('./src/server/init');
const app = require('./src/server/index');
const server = app.listen(port, () => {
  console.log(`[worker] Application is running on port ${port}...`);
});
