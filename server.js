const express = require("express");
const server = express();
const sqlite3 = require("sqlite3").verbose();
const url = "http://localhost:8000/users";
const db = new sqlite3.Database("./gik339-[Grupp 2]-projekt.db"); // Lägg till denna rad

server
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  })
  .use(express.json())
  .use(express.urlencoded({ extended: false }));




// Skapa tabell om den inte finns
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      username TEXT,
      color TEXT
    )
  `);
});

// API-routes

// Hämta alla användare (GET /users)
server.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).send("Fel vid hämtning av användare");
    }
    res.status(200).send(rows);
  });
});

// Lägg till användare (POST /users)
server.post("/users", (req, res) => {
  const { firstName, lastName, username, color } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).send("Saknar förnamn och efternamn");
  }

  const db = new sqlite3.Database("./gik339-[Grupp 2]-projekt.db");
  const sql = "INSERT INTO users (firstName, lastName, username, color) VALUES (?, ?, ?, ?)";
  db.run(sql, [firstName, lastName, username, color], function (err) {
    if (err) {
      return res.status(500).send("Fel vid inmatning i databasen");
    }
    res.status(201).send({ id: this.lastID, firstName, lastName, username, color });
  });
});


// Uppdatera användare (PUT /users/:id)
server.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, username, color } = req.body;
  
    if (!firstName || !lastName) {
      return res.status(400).send("Saknar förnamn och efternamn");
    }
  
    const db = new sqlite3.Database("./gik339-[Grupp 2]-projekt.db");
    const sql = "UPDATE users SET firstName = ?, lastName = ?, username = ?, color = ? WHERE id = ?";
  
    db.run(sql, [firstName, lastName, username, color, id], function (err) {
      if (err) {
        return res.status(500).send("Fel vid uppdatering av användaren: " + err.message);
      }
  
      if (this.changes === 0) {
        return res.status(404).send("Användaren hittas inte");
      }
  
      res.status(200).send({firstName, lastName, username, color, id});
    });
  
    db.close();
  });
  

// Ta bort användare (DELETE /users/:id)
server.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).send("Fel vid borttagning av användare");
    }
    if (this.changes === 0) {
      return res.status(404).send("Användaren hittas inte");
    }
    res.status(200).send("Användaren har raderats");
  });
});

// Starta servern
server.listen(8000, () => {
  console.log("Servern körs på http://localhost:8000");
});

