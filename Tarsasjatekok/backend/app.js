import express from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as db from "./data/db.js";

const PORT = 3000;
const app = express();

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads", { recursive: true });
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "tarsasjatek-session-kulcs-2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Login required" });
  }
  next();
}

await db.ensureDefaultAdmin();
db.importGamesFromCsv("./data/games.csv");


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const existing = db.getUserByUsername(username.trim());
  if (existing) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const saved = await db.createUser(username.trim(), password);
  req.session.user = { id: saved.lastInsertRowid, username: username.trim() };
  res.status(201).json({ message: "Register success", user: req.session.user });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.getUserByUsername(username);
  if (!user) {
    return res
      .status(401)
      .json({ message: "Hibás felhasználónév vagy jelszó" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(401)
      .json({ message: "Hibás felhasználónév vagy jelszó" });
  }

  req.session.user = { id: user.id, username: user.username };
  res.status(200).json({ message: "Sikeres bejelentkezés", user: req.session.user });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout success" });
  });
});

app.get("/me", (req, res) => {
  res.status(200).json({ user: req.session.user || null });
});


app.get("/games", (req, res) => {
  const userId = req.session.user ? req.session.user.id : null;
  const games = db.getVisibleGames(userId);
  res.status(200).json(games);
});

app.get("/games/:id", (req, res) => {
  const game = db.getGameById(+req.params.id);
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const currentUser = req.session.user;
  const isOwner = currentUser && game.owner_id === currentUser.id;
  if (!game.is_public && !isOwner) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.status(200).json(game);
});

app.post("/games", requireAuth, upload.single("image"), (req, res) => {
  const { title, players, playtime, description, is_public } = req.body;
  if (!title || !players || !playtime) {
    return res
      .status(400)
      .json({ message: "Title, players and playtime are required" });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const publicFlag = is_public === "false" || is_public === "0" ? 0 : 1;

  const saved = db.saveGame({
    title: title.trim(),
    players: players.trim(),
    playtime: playtime.trim(),
    description: description ? description.trim() : "",
    image,
    is_public: publicFlag,
    owner_id: req.session.user.id,
  });

  const created = db.getGameById(saved.lastInsertRowid);
  res.status(201).json(created);
});

app.put("/games/:id", requireAuth, upload.single("image"), (req, res) => {
  const id = +req.params.id;
  const game = db.getGameById(id);
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.owner_id !== req.session.user.id) {
    return res
      .status(403)
      .json({ message: "You can only edit your own games" });
  }

  const { title, players, playtime, description, is_public } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : game.image;
  const publicFlag =
    is_public !== undefined
      ? is_public === "false" || is_public === "0"
        ? 0
        : 1
      : game.is_public;

  db.updateGame(id, {
    title: title ? title.trim() : game.title,
    players: players ? players.trim() : game.players,
    playtime: playtime ? playtime.trim() : game.playtime,
    description: description !== undefined ? description.trim() : game.description,
    image,
    is_public: publicFlag,
  });

  const updated = db.getGameById(id);
  res.status(200).json({ message: "Update success", game: updated });
});

app.delete("/games/:id", requireAuth, (req, res) => {
  const id = +req.params.id;
  const game = db.getGameById(id);
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.owner_id !== req.session.user.id) {
    return res
      .status(403)
      .json({ message: "You can only delete your own games" });
  }

  db.deleteGame(id);
  res.status(200).json({ message: "Delete success" });
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));