const express = require("express");
var cors = require("cors");
const Cursor = require("pg-cursor");
const app = express();
const port = 3333;

const { Pool, Client } = require("pg");
const pool = new Pool({
  // user: "phuongpd",
  // password: "Vdkvn.2205",
  // host: "10.1.6.4",
  // port: 5432,
  // database: "well_log",
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "postgres",
});
app.use(cors());

// app.get("/cal_curve_family", async (req, res) => {
//   const client = new Client({
//     user: "phuongpd",
//     password: "Vdkvn.2205",
//     host: "10.1.6.4",
//     port: 5432,
//     database: "well_log",
//     // user: "postgres",
//     // password: "admin",
//     // host: "localhost",
//     // port: 5432,
//     // database: "odoo15_2021"
//   });
//   await client.connect();
//   // const result = await client.query("Select * from cal_curve_value Limit 1000");
//   const result = await client.query("SELECT * FROM cal_curve_family Limit 100000");
//   await client.end();
//   res.send(result?.rows);
// });

// (async () => {
//   const client = await pool.connect();
//   const query = 'SELECT * FROM account_account';

//   const cursor = await client.query(new Cursor(query));

//   cursor.read(1, (err, rows) => {
//       console.log('We got the first row set');
//       console.log(rows);

//       cursor.read(1, (err, rows) => {
//           console.log('This is the next row set');
//           console.log(rows);
//       });
//   });
// })();

app.get("/cal_curve_family", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query("SELECT * from cal_curve_family", function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }

      // console.log(result.rows[0].id);
      res.send(result?.rows);
    });
    //   const fetchUsers = async (userName, userRole) => {
    //     const query = `SELECT *
    //                    FROM "cal_curve_family"
    //                    Where "curve_family_id" = $1`
    //     try {
    //         // await client.connect(); // gets connection
    //         const { rows } = await client.query(query, [userName, userRole]); // sends queries
    //         console.log(rows);
    //     } catch (error) {
    //         console.error(error.stack);
    //     } finally {
    //         await client.end(); // closes connection
    //     }
    // };
    // fetchUsers('True vertical depth subsea')
  });
});

app.get("/cal_curve_value", function (req, res) {
  let offset = +req.query.start;
  let recordsPerPage = +req.query.length;

  let filter1 = "xxxx";

  let result = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
  };

  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }

    client
      .query("SELECT COUNT (*) FROM cal_curve_value")
      .then((queryResult) => {
        result.recordsTotal = +queryResult.rows[0].count;
        result.recordsFiltered = result.recordsTotal;

        return client.query(
          "SELECT * FROM cal_curve_value LIMIT $1 OFFSET $2",
          [recordsPerPage, offset]
        );
      })
      .then((queryResult) => {
        result.data = queryResult.rows;

        res.send(result);
      })
      .catch((e) => {
        // TODO: modify error message before send back to client to prevent sensitive data
        res.status(500).send(e);
        const currentRequest = $.ajax({
          type: "GET",
          url: "http://localhost:3333/cal_curve_value",
        });

        $.ajax({
          type: "GET",
          url: "http://localhost:3333/cal_curve_value",
          beforeSend: () => {
            currentRequest.abort();
          },
          success: (data) => {
            // Success
          },
          error: (e) => {
            // Error
          },
        });
      });
  });
});

app.get("/cal_curve_info", function (req, res) {
  let offset = +req.query.start;
  let recordsPerPage = +req.query.length;

  let filter1 = req.query.filter1;

  let result = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
  };

  pool.connect(function (err, client) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }

    client
      .query("SELECT COUNT (*) FROM cal_curve_info")
      .then((queryResult) => {
        result.recordsTotal = +queryResult.rows[0].count;
        result.recordsFiltered = result.recordsTotal;

        return client.query("SELECT * FROM cal_curve_info LIMIT $1 OFFSET $2", [
          recordsPerPage,
          offset,
        ]);
      })
      .then((queryResult) => {
        result.data = queryResult.rows;
        console.log(req.query);
        res.send(result);
      })
      .catch((e) => {
        // TODO: modify error message before send back to client to prevent sensitive data
        res.status(500).send(e);
      });
    // client
    //   .query("SELECT COUNT (*) FROM cal_curve_info WHERE curve_id = $1", [
    //     filter1,
    //   ])
    //   .then((queryResult) => {
    //     result.recordsTotal = +queryResult.rows[0].count;
    //     result.recordsFiltered = result.recordsTotal;

    //     return client.query(
    //       "SELECT * FROM cal_curve_info WHERE curve_id = $1 LIMIT $2 OFFSET $3",
    //       [filter1, recordsPerPage, offset]
    //     );
    //   })
    //   .then((queryResult) => {
    //     result.data = queryResult.rows;

    //     res.send(result);
    //   })
    //   .catch((e) => {
    //     // TODO: modify error message before send back to client to prevent sensitive data
    //     res.status(500).send(e);
    //   });
  });
});

app.get("/deviation_result", function (req, res) {
  let offset = +req.query.start;
  let recordsPerPage = +req.query.length;

  let filter1 = "";

  let result = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
  };

  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }

    client
      .query("SELECT COUNT (*) FROM deviation_result WHERE record_id = $1", [
        filter1,
      ])
      .then((queryResult) => {
        result.recordsTotal = +queryResult.rows[0].count;
        result.recordsFiltered = result.recordsTotal;

        return client.query(
          "SELECT * FROM deviation_result WHERE record_id = $1 LIMIT $2 OFFSET $3",
          [filter1, recordsPerPage, offset]
        );
      })
      .then((queryResult) => {
        result.data = queryResult.rows;

        res.send(result);
      })
      .catch((e) => {
        // TODO: modify error message before send back to client to prevent sensitive data
        res.status(500).send(e);
      });
  });
});
app.get("/formation_list", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from formation_list limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/formation_set", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from formation_set limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/measure_curve_family", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from measure_curve_family limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/measure_curve_value", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from measure_curve_value limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/reservoir_marker", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from reservoir_marker limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/source", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query("SELECT * from `source`", function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }

      // console.log(result.rows[0].id);
      res.send(result?.rows);
    });
  });
});
app.get("/tool_list", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from tool_list limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/vpins_basin", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from vpins_basin limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/vpins_block", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from vpins_block limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/vpins_well", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from vpins_well limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/well_marker", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from well_marker limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.get("/measure_curve_info", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "SELECT * from measure_curve_info limit 100000",
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        // console.log(result.rows[0].id);
        res.send(result?.rows);
      }
    );
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
