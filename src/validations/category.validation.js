import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(255).required(),
});

export const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(255).required(),
});
