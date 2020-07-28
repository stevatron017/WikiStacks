const { db } = require('./models');
const app = require('./app');

const PORT = 3000;

const init = async () => {
  // `.sync()` creates the table in the database if it doesn't exist (and does nothing if it already exists)
  // We can call this on each individual Sequelize model (e.g. `User`, `Page`), or the entire Sequelize instance (`db`) since our models are defined on it (i.e. `db.define(...)`)
  // https://sequelize.org/master/manual/model-basics.html#model-synchronization
  await db.sync()
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });
}

init();



