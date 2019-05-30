
exports.seed = function(knex, Promise) {
  return knex("students")
    .truncate()
    .then(function() {
      return knex("students").insert([
        { name: "Wyatt", cohort_id: 1 },
        { name: "Grace", cohort_id: 3 },
        { name: "John", cohort_id: 2 },
      ]);
    });
};