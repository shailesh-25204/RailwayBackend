const express = require('express')
const router = express.Router()
const Author = require("../models/train")
const Train = require('../models/train')

//* all authors route
router.get('/trains', async (req, res) => {
    let trains = await Train.find()
    res.send({two: 'hello'})
})




//* getting new author route
// router.get('/', (req, res) => {
//     let trains = Train.find()
//     res.send({trainslist : trains})
//     // res.render('authors/new', { author: new Author() })
// })

//* creating new author route

// router.post('/', async (req, res) => {
//     const author = new Author({
//         name: req.body.name
//     })
//     try {
//         const newAuthor = await author.save()
//         // res.redirect(`authors/${newAuthor.id}`)
//         res.redirect(`authors`)
//     } catch {
//         res.render('authors/new', {
//             author: author,
//             errorMessage: 'Error creating Author'
//         })
//     }
// })

module.exports = router