import Joi from "joi"
import { ObjectId } from "mongodb"

const validateObjectId = id => {
	if (id && ObjectId.isValid(id))
		if (String(new ObjectId(id)) === id) return id
	return "A valid ObjectId"
}

export const getCartValidation = async (req, res, next) => {
	const schema = Joi.object({
		headers: Joi.object({
			authorization: Joi.string()
				.pattern(/^Bearer\s([\w-]*\.[\w-]*\.[\w-]*$)/)
				.required(),
		}).options({ allowUnknown: true }),
	}).options({ allowUnknown: true })
	const { error } = schema.validate(req, { abortEarly: false })
	if (error)
		return res.status(422).send(error.details.map(({ message }) => message))
	next()
}

export const postAndPutProductToCartValidation = async (req, res, next) => {
	const schema = Joi.object({
		body: Joi.object({
			productId: Joi.valid(
				validateObjectId(req.body.productId)
			).required(),
			quantity: Joi.number().integer().min(1).max(9999).required(),
		}),
		headers: Joi.object({
			authorization: Joi.string()
				.pattern(/^Bearer\s([\w-]*\.[\w-]*\.[\w-]*$)/)
				.required(),
		}).options({ allowUnknown: true }),
	}).options({ allowUnknown: true })
	const { error } = schema.validate(req, { abortEarly: false })
	if (error)
		return res.status(422).send(error.details.map(({ message }) => message))
	next()
}

export const deleteProductFromCartValidation = async (req, res, next) => {
	const schema = Joi.object({
		params: Joi.object({
			productId: Joi.valid(
				validateObjectId(req.params.productId),
				"all"
			).required(),
		}),
		headers: Joi.object({
			authorization: Joi.string()
				.pattern(/^Bearer\s([\w-]*\.[\w-]*\.[\w-]*$)/)
				.required(),
		}).options({ allowUnknown: true }),
	}).options({ allowUnknown: true })
	const { error } = schema.validate(req, { abortEarly: false })
	if (error)
		return res.status(422).send(error.details.map(({ message }) => message))
	next()
}
