import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";

const port = 5088;
const ALLOWED_ORIGINS = ["https://relocke.io", "http://localhost:3000"];

export default function InstantiateServer() {
  const app = express();
  const corsOptions = {
    origin: ALLOWED_ORIGINS,
    methods: ["POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", ...ALLOWED_ORIGINS],
        imgSrc: ["'self'"],
        styleSrc: ["'self"],
        objectSrc: ["'none'"], // Prevent object, embed, applet
        fontSrc: ["'self'"],
        connectSrc: ["'self'"], // To prevent XHR and WebSocket attacks
        frameAncestors: ["'none'"], // Prevent your site from being embedded
      },
    })
  );

  // Bind the server to localhost (IPv4 or IPv6 loopback addresses) to limit access.
  app.listen(port, "127.0.0.1");
  // server.listen(port, "::1")

  return app;
}
