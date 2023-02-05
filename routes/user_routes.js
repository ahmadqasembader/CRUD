const express = require('express');
const controller = require('../controller/controllers.js')
const auth = require('../middleware/auth.js')
const router = express.Router();
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended: true}))
router.use(express.json())

const user = new controller("Message from the constructor");

router.get('/', user.index)
router.post('/login', user.login)
router.post('/signup', user.createUser)
router.get('/dashboard', auth, user.dashboard)

router.get('/:username', user.findByUserName)
router.put('/:id', user.editUser)
router.delete('/:id', user.removeUser)

module.exports = router;