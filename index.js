const express = require("express");

const knex = require("knex");
const knexConfig = require("./knexfile.js");

const db = knex(knexConfig.development);

const server = express();
server.use(express.json());



server.get("/", (req, res) => {
  res.send(
    "There are three kinds of people in this world, those who can count and those who can not."
  );
});

server.get("/api/cohorts", (req, res) => {
    db("cohorts")
      .then(cohorts => {
        res.json(cohorts);
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          message: "The cohorts information could not be retrieved."
        });
      });
  });

  server.get("/api/cohorts/:id", (req, res) => {
    const cohortID = req.params.id;
    db("cohorts")
      .where({ id: cohortID })
      .then(cohort => {
        res.status(200).json(cohort);
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          message: "The cohort information could not be retrieved."
        });
      });
  });

  server.get('/:id/students', (req, res) => {
    const id = req.params.id;
    db('cohorts')
      .join('students', 'students.cohort_id', 'cohorts.id')
      .select('students.id', 'students.name')
      .where('cohorts.id', id)
      .then(studentId => {
        if (studentId) {
          res.status(200).json(studentId);
        } else {
          res.status(404).json({ message: 'No students were found, please try again' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  })
  
  server.post("/api/cohorts", (req, res) => {
    db("cohorts")
      .insert(req.body)
      .then(cohorts => {
        res.status(201).json({ message: "Successfully created cohort." });
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          message: "There was an error while saving the cohort to the database."
        });
      });
  });
  
  server.delete("/api/cohorts/:id", (req, res) => {
    const cohortID = req.params.id;
  
    db("cohorts")
      .where({ id: cohortID })
      .delete()
      .then(cohort => {
        res.status(201).end();
      })
      .catch(err => {
        res.status(404).json({
          error: err,
          message: "The cohort with the specified ID does not exist."
        });
      });
  });
  
  server.put("/api/cohorts/:id", (req, res) => {
    db("cohorts")
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if (count > 0) {
          db("cohorts")
            .where({ id: req.params.id })
            .first()
            .then(cohort => {
              res.status(200).json({ message: "Successfully updated cohort." });
            });
        } else {
          res.status(400).json({
            message: "The cohort with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          message: "The cohort information could not be modified."
        });
      });
  });

const port = 5678;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});