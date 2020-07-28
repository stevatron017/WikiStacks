const { db, Page, User } = require("./models");
const app = require("./app");

const PORT = 3000;

const init = async () => {
  // Reference: https://sequelize.org/master/manual/model-basics.html#model-synchronization
  // `.sync()` creates the table in the database if it doesn't exist (and does nothing if it already exists)
  // We can do this two ways:
  // 1. call `.sync()` on each individual Sequelize model (e.g. `User`, `Page`), or
  // await Page.sync()
  // await User.sync()

  // 2. call `.sync()` on the entire Sequelize instance (`db`) since our models are defined on it (i.e. `db.define(...)`)
  await db.sync();

  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });
};

init();
