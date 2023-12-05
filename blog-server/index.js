const sqlite3 = require("sqlite3").verbose();

const express = require("express");
const app = express();

var cors = require("cors");
app.use(cors());

// The root of our server
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "<html><h1>Hello, world!</h1><p>This is the first server for IDIA 618!</p></html>"
    )
    .end();
});

// Checks the connectivity of the database
app.get("/db/checkConnectivity", (req, res) => {
  let logPrefix = "checkConnectivity: ";
  const mydb = new sqlite3.Database(
    "./blog.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.log(logPrefix + "There was an issue opening the database...");
        let response = { "db-status": "error" };
        res.status(200).send(response).end();
      }

      console.log(logPrefix + "Connection successful.");
      let response = { "db-status": "connected" };
      res.status(200).send(response).end();
    }
  );

  mydb.close((err) => {
    if (err) {
      console.log(logPrefix + err.message);
    }

    console.log(logPrefix + "DB connection is closed.");
  });
});

//Admin tasks

// Create the tables in the database
// app.get("/admin/create-tables", (req, res) => {
//   let logPrefix = "create-tables: ";
//   const mydb = new sqlite3.Database(
//     "./blog.db",
//     sqlite3.OPEN_READWRITE,
//     (err) => {
//       if (err) {
//         console.log(logPrefix + "There was an issue opening the database...");
//       }

//       console.log(logPrefix + "Connection successful.");
//     }
//   );

//   let users =
//     "CREATE TABLE users (f_name	TEXT NOT NULL, l_name TEXT NOT NULL, email TEXT NOT NULL, PRIMARY KEY(email))";
//   let passwords =
//     "CREATE TABLE passwords(email TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY(email), FOREIGN KEY(email) REFERENCES users(email) ON DELETE CASCADE)";
//   let posts =
//     "CREATE TABLE posts (id TEXT NOT NULL, email TEXT NOT NULL, title TEXT NOT NULL, subtitle TEXT NOT NULL, image BLOB, body TEXT NOT NULL, type TEXT NOT NULL, PRIMARY KEY(id) FOREIGN KEY(email) REFERENCES users(email) ON DELETE CASCADE)";

  // Creating the tables. We must start with the users table because there is an attribute in the passwords table that references the users table.
//   mydb.serialize(() => {
//     mydb.run(users);
//     mydb.run(passwords);
//     mydb.run(posts);
//   });

//   res.status(200).send({ response: "tables-created" }).end();

//   mydb.close((err) => {
//     if (err) {
//       console.log(logPrefix + err.message);
//     }

//     console.log(logPrefix + "DB connection is closed.");
//   });
// });

// Endpoint: populate
app.get("/admin/populate", (req, res) => {
  let logPrefix = "populate: ";

  let query_1 =
    'INSERT INTO "users" ("f_name", "l_name", "email") VALUES ("Hannah", "Leigh", "hannah.leigh.gmail")';

  let mydb = new sqlite3.Database(
    "./blog.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.log(logPrefix + "There was an issue opening the database...");
      }
console.log(logPrefix + "connection successful")
    }
  );
  mydb.run(query_1, function (err) {
    if (err) {
      newRecord = { insert: "failed" };
      return console.log(err.message);
    }
  });

  res.status(200).send({ insert: "successful" }).end();

  mydb.close();
});

// Endpoint: showData
app.get("/admin/show-data", (req, res) => {
    let logPrefix = "show-data: ";
  
    let mydb = new sqlite3.Database(
    "./blog.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.log(logPrefix + "There was an issue opening the database...");
      }

      console.log(logPrefix + "Connection successful.");
    }
  );

  let query = "SELECT f_name, l_name, email FROM users";

  let response = [];

  mydb.all(query, [], (err, rows) => {
    console.log(rows, "rows")
    if (err) {
      res.status(200).send(err).end();
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
      response.push(row);
    });

    res.status(200).send(response).end();
  });

  // close the database connection
  mydb.close();
});

// Endpoint: truncateData
app.get('/admin/truncate', (req, res) => {
    let logPrefix = "truncate: ";
    let mydb = new sqlite3.Database(
        "./blog.db",
        sqlite3.OPEN_READWRITE,
        (err) => {
          if (err) {
            console.log(logPrefix + "There was an issue opening the database...");
          }
    
          console.log(logPrefix + "Connection successful.");
        }
      );

    let truncate_query = `DELETE FROM users`;

    let response = {};

    mydb.run(truncate_query, function (err) {
        if (err) {
            response.passwords = "error";
            return console.log(err.message);
        }

        res
            .status(200)
            .send({"table":"truncated"})
            .end();
    });

    mydb.close();
});

//Delete
// Endpoint: delete
app.get('/admin/delete', (req, res) => {
    let logPrefix = "dropTables: ";
    const mydb = new sqlite3.Database("./blog.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.log(logPrefix + "There was an issue opening the database...");
        }

        console.log(logPrefix + "Connection successful.");
    });

    let users = "DROP TABLE users";

    // Dropping all the tables. We must start with the passwords table because there in information there that references the users table.
    mydb.serialize(() => {
        mydb.run(users);
    });

    res
        .status(200)
        .send({ "response": "tables-dropped" })
        .end();

    mydb.close((err) => {
        if (err) {
            console.log(logPrefix + err.message);
        }

        console.log(logPrefix + "DB connection is closed.");
    });
});

// Start the server
const PORT = process.env.PORT || 8618;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(
    `To access the server, visit to the following address: http://localhost:${PORT}/`
  );
  console.log("Press Ctrl+C to quit.");
});
