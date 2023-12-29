const { Schema } = require("zod");


const validate = (schema) => async (req, res, next ) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error})
    }

}

module.exports = validate;