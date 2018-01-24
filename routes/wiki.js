const express = require("express");
const router = express.Router();
const models = require("../models");
const Page = models.Page;
const User = models.User;
const { main, addPage, editPage, wikiPage } = require("../views");

// /wiki
router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) { next(error) }
});

// /wiki
router.post("/", async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    const page = await Page.create(req.body);

    page.setAuthor(user);

    res.redirect("/wiki/" + page.slug);
  } catch (error) { next(error) }
});

router.get("/search", async (req, res, next) => {
  try {
    const pages = await Page.findAll({
      where: {
        tags: {
          $contains: [req.query.search]
        }
      }
    });

    res.send(main(pages));
  } catch (error) { next(error) }
});

router.post("/:slug", async (req, res, next) => {
  try {
    const [updatedRowCount, updatedPages] = await Page.update(req.body, {
      where: {
        slug: req.params.slug
      },
      returning: true
    });

    res.redirect("/wiki/" + updatedPages[0].slug);
  } catch (error) { next(error) }
});

router.get("/:slug/delete", async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        slug: req.params.slug
      }
    });

    res.redirect("/wiki");
  } catch (error) { next(error) }
});

// /wiki/add
router.get("/add", (req, res) => {
  res.send(addPage());
});

// /wiki/(dynamic value)
router.get("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });
    if (page === null) {
      throw generateError("No page found with this title", 404);
    } else {
      const author = await page.getAuthor();
      res.send(wikiPage(page, author));
    }
  } catch (error) { next(error) }
});

router.get("/:slug/edit", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (page === null) {
      //to show you sendStatus in contrast to using the error handling middleware above
      res.sendStatus(404);
    } else {
      const author = await page.getAuthor();
      res.send(editPage(page, author));
    }
  } catch (error) { next(error) }
});

// /wiki/(dynamic value)
router.get("/:slug/similar", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (page === null) {
      throw generateError("No pages correspond to this title", 404);
    } else {
      const similar = await Page.findAll({
        where: {
          id: { $ne: page.id },
          tags: { $overlap: page.tags }
        }
      });

      res.send(main(similar));
    }
  } catch (error) { next(error) }
});

const generateError = (message, status) => {
  let err = new Error(message);
  err.status = status;
  return err;
};

module.exports = router;
