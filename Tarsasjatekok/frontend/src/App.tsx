import { useEffect, useState } from "react";
import api from "src\api\api.ts";
import "./App.css";

const API_URL = "http://localhost:3000";

export default function App() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [filterOwnOnly, setFilterOwnOnly] = useState(false);

  // Auth űrlap állapotok
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Játék űrlap állapotok
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [players, setPlayers] = useState("");
  const [playtime, setPlaytime] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  async function loadUserAndGames() {
    try {
      const [meRes, gamesRes] = await Promise.all([
        api.get("/me"),
        api.get("/games"),
      ]);
      setUser(meRes.data.user);
      setGames(gamesRes.data);
    } catch (err) {
      console.error("Hiba a betöltéskor:", err);
    }
  }

  useEffect(() => {
    loadUserAndGames();
  }, []);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthError("");

    const endpoint = authMode === "login" ? "/login" : "/register";
    try {
      await api.post(endpoint, { username, password });
      setUsername("");
      setPassword("");
      await loadUserAndGames();
    } catch (err) {
      setAuthError(err.response?.data?.message || "Hiba történt.");
    }
  }

  async function handleLogout() {
    try {
      await api.post("/logout");
      setUser(null);
      setFilterOwnOnly(false);
      resetForm();
      await loadUserAndGames();
    } catch (err) {
      console.error("Hiba kijelentkezéskor:", err);
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setPlayers("");
    setPlaytime("");
    setDescription("");
    setIsPublic(true);
    setImageFile(null);
    setFormError("");
  }

  async function handleGameSubmit(e) {
    e.preventDefault();
    setFormMessage("");
    setFormError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("players", players);
    formData.append("playtime", playtime);
    formData.append("description", description);
    formData.append("is_public", String(isPublic));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        await api.put(`/games/${editingId}`, formData);
        setFormMessage("Sikeresen módosítva!");
      } else {
        await api.post("/games", formData);
        setFormMessage("Új társasjáték hozzáadva!");
      }
      resetForm();
      await loadUserAndGames();
    } catch (err) {
      setFormError(err.response?.data?.message || "Hiba a mentés során.");
    }
  }

  function startEditing(game) {
    setEditingId(game.id);
    setTitle(game.title);
    setPlayers(game.players);
    setPlaytime(game.playtime);
    setDescription(game.description || "");
    setIsPublic(Boolean(game.is_public));
    setImageFile(null);
    setFormMessage("");
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a társasjátékot?")) return;

    try {
      await api.delete(`/games/${id}`);
      if (editingId === id) resetForm();
      await loadUserAndGames();
    } catch (err) {
      setFormError(err.response?.data?.message || "Hiba a törlés során.");
    }
  }

  const displayedGames =
    user && filterOwnOnly ? games.filter((g) => g.owner_id === user.id) : games;

  return (
    <div className="container">
      <header className="header">
        <h1>🎲 Társasjáték Katalógus</h1>
        {user ? (
          <div className="user-bar">
            <span>
              Bejelentkezve: <strong>{user.username}</strong>
            </span>
            <button className="btn-secondary" onClick={handleLogout}>
              Kijelentkezés
            </button>
          </div>
        ) : (
          <span className="guest-badge">Vendég mód (csak publikus adatok)</span>
        )}
      </header>

      {!user && (
        <section className="card auth-box">
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
            >
              Bejelentkezés
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
              }}
            >
              Regisztráció
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="form-grid">
            <input
              type="text"
              placeholder="Felhasználónév (pl. admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Jelszó (pl. titok123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              {authMode === "login" ? "Belépés" : "Fiók létrehozása"}
            </button>
          </form>
          {authError && <p className="error">{authError}</p>}
        </section>
      )}

      {user && (
        <section className="card form-box">
          <h2>
            {editingId ? "Társasjáték szerkesztése" : "Új társasjáték hozzáadása"}
          </h2>
          <form onSubmit={handleGameSubmit} className="form-grid">
            <input
              type="text"
              placeholder="Játék neve (pl. Azul)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Játékosszám (pl. 2-4 fő)"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Játékidő (pl. 45 perc)"
              value={playtime}
              onChange={(e) => setPlaytime(e.target.value)}
              required
            />
            <textarea
              placeholder="Rövid leírás..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <label className="file-label">
              Kép feltöltése:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Publikus (vendégek is láthatják)
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? "Módosítások mentése" : "Hozzáadás"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Mégse
                </button>
              )}
            </div>
          </form>
          {formError && <p className="error">{formError}</p>}
          {formMessage && <p className="success">{formMessage}</p>}
        </section>
      )}

      <div className="list-header">
        <h2>
          {user && filterOwnOnly
            ? "Saját társasjátékaim"
            : "Elérhető társasjátékok"}{" "}
          ({displayedGames.length})
        </h2>
        {user && (
          <div className="filter-buttons">
            <button
              className={!filterOwnOnly ? "active" : ""}
              onClick={() => setFilterOwnOnly(false)}
            >
              Összes látható
            </button>
            <button
              className={filterOwnOnly ? "active" : ""}
              onClick={() => setFilterOwnOnly(true)}
            >
              Csak a sajátjaim
            </button>
          </div>
        )}
      </div>

      <div className="games-grid">
        {displayedGames.map((game) => {
          const isOwner = user && game.owner_id === user.id;

          return (
            <article key={game.id} className="game-card">
              {game.image ? (
                <img
                  src={`${API_URL}${game.image}`}
                  alt={game.title}
                  className="game-img"
                />
              ) : (
                <div className="game-img-placeholder">Nincs kép</div>
              )}

              <div className="game-body">
                <div className="game-top">
                  <h3>{game.title}</h3>
                  {!game.is_public && (
                    <span className="private-tag">Privát</span>
                  )}
                </div>

                <p className="meta">
                  👥 {game.players} • ⏱️ {game.playtime}
                </p>
                <p className="desc">{game.description}</p>
                <p className="owner">Feltöltötte: {game.owner_name}</p>

                {isOwner && (
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => startEditing(game)}
                    >
                      Szerkesztés
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(game.id)}
                    >
                      Törlés
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}