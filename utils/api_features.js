const { buildFilterObject } = require("../constens/filteration_formating")

class ApiFeatures {
    constructor(mongooseQuery , req){
        this.mongooseQuery = mongooseQuery
        this.req = req
        this.filteration = {}
        this.page = 1
    }

    filter() {
        const queryObj = {...this.req.query}
        const excludesFields = ['limit' , 'page' , 'sort' , 'fields' , 'keyword']
        excludesFields.forEach(feild  => delete queryObj[feild])
        const filterationFormat = buildFilterObject(queryObj)
        this.filteration = {...this.req.filterObj , ...filterationFormat}

        return this
    }

    sort() {
        if(this.req.query.sort){
            const cleanSort = this.req.query.sort.split(',').join(' ')  
            this.mongooseQuery = this.mongooseQuery.sort(cleanSort)
        }else{
            this.mongooseQuery = this.mongooseQuery.sort("createdAt")
        }

        return this
    }

    limitFields() {
        if(this.req.query.fields){
            const cleanFields = this.req.query.fields.split(",").join(" ")
            this.mongooseQuery = this.mongooseQuery.select(cleanFields)
        }else{
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }

        return this
    }

    search(model) {
        if(this.req.query.keyword){
            let query = {}
            if(model === "products"){
                query.$or = [
                    {name: {$regex : this.req.query.keyword , $options: "i"}},
                    {descraption: {$regex : this.req.query.keyword , $options: "i"}}
                ]
            }else{
                query.$or = [
                    {name: {$regex : this.req.query.keyword , $options: "i"}},
                ]
            }
            this.filteration = {...this.filteration , ...query}
        }

        return this
    }

    paginate() {
        const limit = Number(this.req.query.limit) || 20
        this.page = Number(this.req.query.page) || 1
        const skip = (this.page - 1) * limit

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)

        return this
    }

    applyFilterAndSearch() {
        this.mongooseQuery = this.mongooseQuery.find(this.filteration)
        return this
    }

}

module.exports = ApiFeatures