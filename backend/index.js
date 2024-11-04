const express = require("express");
const app = express();
require("express-ws")(app);
const prisma = require("./prismaClient");
const cors = require("cors");
// const { swaggerUi, swaggerSpec } = require('./swagger');

const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3001',
      /^https?:\/\/.*\.ngrok-free\.app$/
    ];
    
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: false
};

app.use(cors(corsOptions));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { wsRouter } = require("./routers/ws");
app.use("/", wsRouter);

// const { contentRouter } = require("./routers/content");
// app.use("/content", contentRouter);

const { songRouter } = require("./routers/song");
app.use("/", songRouter);

const { userRouter } = require("./routers/user");
app.use("/", userRouter);

const { savedSongsRouter } = require("./routers/savedSongs");
app.use("/saved-songs", savedSongsRouter);

app.get("/info", (req, res) => {
    res.json({ msg: "ThiSo API" });
});

// Import and use the Swagger configuration
require('./swagger')(app);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const gracefulShutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log("ThiSo API closed.");
        process.exit(0);
    });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);