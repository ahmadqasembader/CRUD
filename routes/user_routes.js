const User = require('../mongoose');
const express = require('express');
const controller = require('../controller/controllers.js')

const router = express.Router();

router.use(express.json())

const user = new controller("Message from the constructor");

router.get('/login', user.login)
router.get('/', user.findAllEntries)
router.get('/:username', user.findByUserName)
router.post('/create', user.createUser)
router.put('/:id', user.editUser)
router.delete('/:id', user.removeUser)

module.exports = router;