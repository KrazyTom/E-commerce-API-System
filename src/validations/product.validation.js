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
