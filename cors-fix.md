# CORS Fix for Bills Utility Application

## Issue

The Bills Utility application encounters CORS errors when trying to communicate between the Electron frontend (running on the `app://` protocol) and the local Express server (running on `http://localhost:5000`).

## Solution

To fix this issue, you need to update the CORS configuration in the server.js file. Follow these steps:

1. Close the Bills Utility application if it's running
2. Navigate to: `dist\win-unpacked\resources\server`
3. Open `server.js` in a text editor
4. Find the CORS configuration section (around line 100-120)
5. Replace the CORS configuration with the following code:

```javascript
// CORS middleware must be before other middleware and route handlers
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Electron 'file://' protocol)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow localhost and Electron's app:// protocol
    if (/localhost|127\.0\.0\.1|^app:\/\/\./.test(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Pre-flight OPTIONS response for CORS
app.options('*', cors());

// Middleware to parse JSON body
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Security: Only allow local connections
const server = app.listen(PORT, '127.0.0.1', () => {
```

6. Save the file
7. Launch the Bills Utility application again

This change will allow the Electron app (using the `app://` protocol) to communicate with the local Express server.

## Explanation

The CORS issue happens because the packaged Electron app runs under the `app://` protocol, but it's trying to communicate with the server running on `http://localhost:5000`. The updated CORS configuration:

1. Explicitly allows requests from the `app://` protocol
2. Adds proper OPTIONS request handling for CORS preflight requests
3. Includes appropriate headers needed for cross-origin requests
4. Provides better logging to diagnose any communication issues 