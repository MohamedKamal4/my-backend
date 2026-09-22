const AsyncHandler = require("express-async-handler")
const slugify = require("slugify")

function Create(model) {
    return AsyncHandler(async (req, res, next) => {
        if (req.body.name) { 
            req.body.slug = slugify(req.body.name)
        }
        const data = await model.create(req.body)
        res.status(201).json({ data })
    })
}

module.exports = Create