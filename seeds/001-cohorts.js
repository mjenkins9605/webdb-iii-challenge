exports.seed = function(knex, Promise) {
  return knex('cohorts').truncate()
  .then(function () {
  return knex("cohorts").insert([
    { id: 1, name: "webpt4" },
    { id: 2, name: "webpt5" },
    { id: 3, name: "webpt6" }
  ]);
});
};
