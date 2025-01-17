const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors"); 


const app = express();
app.use(cors()); 
app.use(bodyParser.json());

// Skapa SQLite-databas
const db = new sqlite3.Database("./gik339-2-projekt.db");



db.serialize(() => {
  db.run(`
    CREATE TABLE cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      color TEXT,
      year INTEGER
    )
  `);
});

// Hämta alla bilar
app.get("/cars", (req, res) => {
  db.all("SELECT * FROM cars", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


// Lägg till en bil
app.post("/cars", (req, res) => {
  const { brand, color, year } = req.body;
  db.run(
    "INSERT INTO cars (brand, color, year) VALUES (?, ?, ?)",
    [brand, color, year],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Uppdatera en bil
app.put("/cars/:id", (req, res) => {
  const { brand, color, year } = req.body;
  const { id } = req.params;
  db.run(
    "UPDATE cars SET brand = ?, color = ?, year = ? WHERE id = ?",
    [brand, color, year, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
});

// Ta bort en bil
app.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cars WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Starta servern
app.listen(8000, () => {
  console.log("Servern körs på http://localhost:8000");
});
