import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().positive().required(),
  stockQuantity: Joi.number().integer().min(0).required(),
  categoryId: Joi.number().integer().optional(),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().positive().optional(),
  stockQuantity: Joi.number().integer().min(0).optional(),
  categoryId: Joi.number().integer().optional(),
});


export const getProductSchema = Joi.object({
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  categoryId: Joi.number().integer().optional(),
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),    
});