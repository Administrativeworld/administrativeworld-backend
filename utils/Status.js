import statusMonitor from "express-status-monitor";

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

// Extract the page route from the same instance
const monitorRoute = monitorMiddleware.pageRoute;

// Export the middleware and page route
export default { monitorMiddleware, monitorRoute };
