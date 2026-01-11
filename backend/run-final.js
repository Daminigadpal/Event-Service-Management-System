// Final working server runner
console.log('🚀 Starting backend from correct location...');

// Get current directory and move to backend
const path = require('path');
const backendDir = path.join(__dirname, 'backend');
process.chdir(backendDir);

console.log('📁 Current directory:', process.cwd());
console.log('📁 Backend directory:', backendDir);

// Start the server
require('./simple-server.js');
