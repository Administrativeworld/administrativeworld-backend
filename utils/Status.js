const statusMonitor = require("express-status-monitor");

const monitorMiddleware = statusMonitor({
  title: "AD World App Status", 
  path: "/status",        
  spans: [
    { interval: 1, retention: 60 }, 
    { interval: 5, retention: 60 },  
    { interval: 15, retention: 60 }, 
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    eventLoop: true,
    heap: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
});

// Export the middleware and page route
module.exports = {
  monitorMiddleware,
  monitorRoute: statusMonitor().pageRoute,
};
