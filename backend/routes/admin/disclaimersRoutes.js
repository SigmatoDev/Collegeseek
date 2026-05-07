const express = require('express');
const { createDisclaimer, getDisclaimers, getDisclaimerBySlug, getDisclaimerById, updateDisclaimer, deleteDisclaimer } = require('../../controllers/admin/disclaimerController');


const router = express.Router();

router.post('/create/disclaimer', createDisclaimer);
router.get('/disclaimer', getDisclaimers);
router.get('/disclaimer/slug/:slug', getDisclaimerBySlug);
router.get('/getid/disclaimer/:id', getDisclaimerById);
router.put('/disclaimer/:id', updateDisclaimer);
router.delete('/disclaimer/:id', deleteDisclaimer);

module.exports = router;