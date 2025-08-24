


const { spawn } = require('child_process');

// Start the MCP server as a child process
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    WEATHER_API_KEY: 'placeholder'
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

// Handle server output
serverProcess.stdout.on('data', (data) => {
  console.log('Server stdout:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString());
});

// Send a request to the server after a short delay
setTimeout(() => {
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tool/get_weather",
    params: {
      location: "London"
    }
  };
  
  // Write the request to the server's stdin
  serverProcess.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

// Handle process exit
serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the script running
process.stdin.pipe(serverProcess.stdin);
serverProcess.stdout.pipe(process.stdout);


