const User = require('../mongoose');
const express = require('express');
var jwt = require('jsonwebtoken');
const controller = require('../controller/controllers.js')

const router = express.Router();

router.use(express.json())

router.get('/', controller.findAllEntries)
router.get('/:username', controller.findByUsername)
router.post('/create', controller.createUser)
router.put('/:id', controller.editUser)
router.delete('/:id', controller.removeUser)

module.exports = router;