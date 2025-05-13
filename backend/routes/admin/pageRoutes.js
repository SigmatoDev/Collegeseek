const express = require("express");
const { createPages, getPageById, getPageBySlug, getPages } = require("../../controllers/admin/pagesController");
const { updatePage } = require("../../controllers/admin/pagesUpdateContoller");

const router = express.Router();

router.post("/create/pages", createPages); // no multer needed
router.get("/get/pages", getPages);
router.get("/pages/by/id/:id", getPageById);
router.get('/pages/by/slug/:slug', getPageBySlug);
router.put('/updatePage/by/:id', updatePage);

module.exports = router;

// Route to create a page
// router.post("/pages", createPage);

// // Route to get all pages

// router.post('/image',  uploadImage); // Use 'upload' as middleware

// router.get('/id/pages/:id', getPageById);

// // Route for updating a page by ID
// router.put('/edit/:id', updatePage);

// // Route for deleting a page by ID
// router.delete('/d/page/:id', deletePage);

// router.post("/create/pages", uploadMiddleware,createPages);




// module.exports = router;
