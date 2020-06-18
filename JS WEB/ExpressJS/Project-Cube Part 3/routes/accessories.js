const express = require('express');
const router = express.Router();
const Accessory = require('../models/accessory');
const getCube = require('../controllers/cubeController');

router.get('/create/accessory', (req, res) => {
    res.render('createAccessory');
})

router.post('/create/accessory', (req, res) => {
    const {
        name,
        description,
        imageUrl,
    } = req.body

    const accessory = new Accessory({
        name,
        description,
        imageUrl,
    });

    accessory.save();
    res.redirect(302, '/');
})

router.get('/attach/accessory/:id', async (req, res) => {

    const cube = await getCube(req.params.id);
    const accessories = await Accessory.find().lean();

    const cubeAccessory = cube.accessories.map(acc => String(acc._id));
    const notAttachedAccessories = accessories.filter(acc => !cubeAccessory.includes(String(acc._id)));


    res.render('attachAccessory', {
        notAttachedAccessories,
        cube,
        isFullorEmpty: cube.accessories.length === accessories.length
            || cube.accessories.length === 0,
        isFull: cube.accessories.length === accessories.length
    })
})

router.post('/attach/accessory/:id', async (req, res) => {

    const { accessory } = req.body

    await Cube.findByIdAndUpdate(req.params.id, {
        $addToSet:
            { accessories: [accessory] }
    })


    res.redirect(302, `/details/${req.params.id}`)
})

module.exports = router;