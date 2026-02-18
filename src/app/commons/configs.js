const SWAGGER_CONFIGS = {
  routePrefix: "/documentation",
  mode: "dynamic",
  openapi: {
    info: {
      title: "ERP Node API Services Node",
      description: "API Docs for the Healthuno API Services",
      version: "0.1.0"
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here"
    },
    servers: [
      {
        url: "http://localhost:4444",
        description: "Staging server"
      },
      {
        url: "https://kpnweb.bluekode.com",
        description: "Production server"
      }
    ],
    tags: [{ name: "Medical API Services" }]
  }
};

const SWAGGER_UI_CONFIGS = {
  routePrefix: "/documentation",
  initOAuth: {},
  uiConfig: {
    docExpansion: "full",
    deepLinking: false
  },
  uiHooks: {
    onRequest(request, reply, next) {
      next();
    },
    preHandler(request, reply, next) {
      next();
    }
  },
  staticCSP: true,
  transformStaticCSP: header => header
};

// eslint-disable-next-line complexity
function severity(label) {
  switch (label) {
    case "trace":
      return "DEBUG";
    case "debug":
      return "DEBUG";
    case "info":
      return "INFO";
    case "warn":
      return "WARNING";
    case "error":
      return "ERROR";
    case "fatal":
      return "CRITICAL";
    default:
      return "DEFAULT";
  }
}

function level(label) {
  return { severity: severity(label) };
}

const SERVER_CONFIGS = {
  logger: {
    formatters: {
      level
    },
    redact: {
      paths: [
        "authorization",
        "error.headers.authorization",
        "error.authorization",
        "headers.authorization",
        "request.headers.authorization",
        "request.raw_headers.authorization",
        "request.body.transaction_hash"
      ],
      censor: "****"
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          hostname: req.hostname,
          path: req.path,
          parameters: req.parameters,
          id: req.id,
          traceHeaders: {
            "x-request-id": req.headers["x-request-id"],
            "x-b3-traceid": req.headers["x-b3-traceid"],
            "x-b3-spanid": req.headers["x-b3-spanid"],
            "x-b3-parentspanid": req.headers["x-b3-parentspanid"],
            "x-b3-sampled": req.headers["x-b3-sampled"],
            "x-b3-flags": req.headers["x-b3-flags"],
            "x-ot-span-context": req.headers["x-ot-span-context"],
            "x-perf-id": req.headers["x-perf-id"]
          }
        };
      }
    },
    level: process.env.LOG_LEVEL || "info",
    ...(process.env.NODE_ENV === "development" && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          levelFirst: true
        }
      }
    })
  },
  disableRequestLogging: true,
  exposeHeadRoutes: false,
  keepAliveTimeout: 10000
};

module.exports = {
  SWAGGER_CONFIGS,
  SERVER_CONFIGS,
  SWAGGER_UI_CONFIGS
};
