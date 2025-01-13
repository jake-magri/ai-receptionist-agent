import * as express from 'express';

// Extend Express to include a `server` property
declare global {
  namespace Express {
    interface Application {
      server: http.Server; // Add the server property to the Express app
    }
  }
}
