import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const db = new Database("./data/games.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
  `
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    players TEXT NOT NULL,
    playtime TEXT NOT NULL,
    description TEXT,
    image TEXT,
    is_public INTEGER DEFAULT 1,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  )
  `
).run();

// --- FELHASZNÁLÓI FÜGGVÉNYEK ---

export const getUserByUsername = (username) =>
  db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);

export const getUserById = (id) =>
  db.prepare(`SELECT id, username FROM users WHERE id = ?`).get(id);

export const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db
    .prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
    .run(username, hashedPassword);
};

export const ensureDefaultAdmin = async () => {
  const count = db.prepare(`SELECT COUNT(*) AS count FROM users`).get().count;
  if (count === 0) {
    await createUser("admin", "titok123");
  }
};

// --- TÁRSASJÁTÉK FÜGGVÉNYEK ---

// Vendég: csak publikus (is_public = 1)
// Belépett felhasználó: publikus VAGY saját (owner_id = userId)
export const getVisibleGames = (userId = null) => {
  if (userId) {
    return db
      .prepare(
        `
        SELECT games.*, users.username AS owner_name
        FROM games
        JOIN users ON games.owner_id = users.id
        WHERE games.is_public = 1 OR games.owner_id = ?
        ORDER BY games.id DESC
        `
      )
      .all(userId);
  }

  return db
    .prepare(
      `
      SELECT games.*, users.username AS owner_name
      FROM games
      JOIN users ON games.owner_id = users.id
      WHERE games.is_public = 1
      ORDER BY games.id DESC
      `
    )
    .all();
};

export const getGameById = (id) =>
  db.prepare(`SELECT * FROM games WHERE id = ?`).get(id);

export const saveGame = ({
  title,
  players,
  playtime,
  description,
  image,
  is_public,
  owner_id,
}) =>
  db
    .prepare(
      `
      INSERT INTO games (title, players, playtime, description, image, is_public, owner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(title, players, playtime, description, image, is_public, owner_id);

export const updateGame = (
  id,
  { title, players, playtime, description, image, is_public }
) =>
  db
    .prepare(
      `
      UPDATE games
      SET title = ?, players = ?, playtime = ?, description = ?, image = ?, is_public = ?
      WHERE id = ?
      `
    )
    .run(title, players, playtime, description, image, is_public, id);

export const deleteGame = (id) =>
  db.prepare(`DELETE FROM games WHERE id = ?`).run(id);

// --- CSV IMPORTÁLÁS A nev.db ADATBÁZISBA ---

export const importGamesFromCsv = (csvFilePath = "./data/games.csv") => {
  const resolvedPath = path.resolve(csvFilePath);
  if (!fs.existsSync(resolvedPath)) {
    return { imported: 0, message: "CSV fájl nem található" };
  }

  const raw = fs.readFileSync(resolvedPath, "utf-8").trim();
  const lines = raw.split(/\r?\n/).slice(1);

  const insertStmt = db.prepare(
    `
    INSERT OR IGNORE INTO games
      (id, title, players, playtime, description, image, is_public, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
  );

  const runImport = db.transaction((rows) => {
    let imported = 0;
    for (const line of rows) {
      if (!line.trim()) continue;
      const [id, title, players, playtime, description, image, is_public, owner_id] =
        line.split(";");

      const info = insertStmt.run(
        id ? Number(id) : null,
        (title || "").trim(),
        (players || "").trim(),
        (playtime || "").trim(),
        (description || "").trim(),
        (image || "").trim(),
        is_public !== undefined && is_public !== "" ? Number(is_public) : 1,
        owner_id !== undefined && owner_id !== "" ? Number(owner_id) : 1
      );

      if (info.changes > 0) imported++;
    }
    return imported;
  });

  const imported = runImport(lines);
  return { imported, message: "CSV import kész" };
};