const express = require('express');
const { createContact, getContacts } = require('../../controller/user/contact-controller');
const router = express.Router();
router.post('/', createContact);
router.get('/', getContacts);

module.exports = router;


module.exports = router;
