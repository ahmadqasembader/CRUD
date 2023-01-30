const User = require('../mongoose');
const express = require('express');
const controller = require('../controller/controllers.js')

const router = express.Router();

router.use(express.json())

router.get('/login', controller.login)
router.get('/', controller.findAllEntries)
router.get('/:username', controller.findByUsername)
router.post('/create', controller.createUser)
router.put('/:id', controller.editUser)
router.put('/resetPassword/:id', controller.resestPassword)
router.delete('/:id', controller.removeUser)

module.exports = router;