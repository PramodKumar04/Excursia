const Joi  = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().optional(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().integer().min(1).max(5).required()
    }).required()
})