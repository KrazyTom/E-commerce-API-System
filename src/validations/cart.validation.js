import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const removeFromCartSchema = Joi.object({
  productId: Joi.number().integer().required(),
});
