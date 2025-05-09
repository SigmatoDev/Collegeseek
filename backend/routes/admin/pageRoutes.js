// routes/admin/pageRoutes.js

const express = require("express");
const { createPage, getPages, uploadImage, getPageById, updatePage, deletePage } = require("../../controllers/admin/pageController");
const router = express.Router();

// Route to create a page
router.post("/pages", createPage);

// Route to get all pages
router.get("/get/pages", getPages);

router.post('/image',  uploadImage); // Use 'upload' as middleware

router.get('/id/pages/:id', getPageById);

// Route for updating a page by ID
router.put('/edit/:id', updatePage);

// Route for deleting a page by ID
router.delete('/d/page/:id', deletePage);



module.exports = router;
