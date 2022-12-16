const express = require('express');
const router = express.Router();

// create a JSON data array
let data = [
    { id: 1, firstname: 'Ahmad', lastname: "Bader", email: "ahmadbader@gunsel.com", createdOn: new Date() },
    { id: 2, firstname: 'Ali', lastname: "Mohamad", email: "aliahmad@gunsel.com", createdOn:  new Date() },
];


// READ
router.get('/', function (req, res) {
    res.status(200).json(data);
});

// READ specific id
router.get('/:id', function (req, res) {
    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });
    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});

// CREATE
router.post('/', function (req, res) {
    let itemIds = data.map(item => item.id);
    
    let lastnameNums = data.map(item => item.lastname);

    let newId = itemIds.length > 0 ? Math.max.apply(Math, itemIds) + 1 : 1;

    let lastnameNum = lastnameNums.length > 0 ? Math.max.apply(Math, lastnameNums) + 1 : 1;

    // create an object of new Item
    let newItem = {
        id: newId,
        firstname: req.body.firstname,
        lastname: lastnameNum,
        email: firstname + lastname + "@gunsel.com",
        createdOn: new Date()
    };

    
    data.push(newItem);


    res.status(201).json(newItem);
});

// UPDATE
router.put('/:id', function (req, res) {
    
    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });

    // check if found
    if (found) {
        let updated = {
            id: found.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname, 
            email: req.body.email
        };

        let targetIndex = data.indexOf(found);

        data.splice(targetIndex, 1, updated);


        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// DELETE
router.delete('/:id', function (req, res) {
    
    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });

    if (found) {
        let targetIndex = data.indexOf(found);

        data.splice(targetIndex, 1);
    }

    res.sendStatus(204);
});

module.exports = router;
