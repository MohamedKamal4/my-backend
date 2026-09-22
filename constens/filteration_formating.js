exports.buildFilterObject = (queryObj) => {
    const filter = {}

    for (const key in queryObj) {

        const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/)

        if (match) {
            const field = match[1]
            const operator = `$${match[2]}`

            if (!filter[field]) {
                filter[field] = {}
            }

            filter[field][operator] = Number(queryObj[key])
        } else {
            filter[key] = queryObj[key]
        }
    }

    return filter
}