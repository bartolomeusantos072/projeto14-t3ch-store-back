
import Joi from "joi"
import  {isValidId} from "../middlaware/objectValidation.js";


 const checkoutValidation = async (req, res, next) => {
  const { checkoutId, productId } = req.params
  
  if (checkoutId || productId) {
    if (checkoutId && !isValidId(checkoutId)) {
      return res
        .status(422)
        .send("id, this checkoutId is invalid id. checkoutId: " + checkoutId)
    }

    if (!checkoutId && productId && !isValidId(productId))
      return res
        .status(422)
        .send("id, this productId is invalid id. productId: " + productId)
  }

  if (checkoutId) {
    return next()
  }

  const checkoutSchema = Joi.object({
    paymentType: Joi.string().valid("cash", "credit", "ticket").required(),
    parcel: Joi.number().min(1).max(10),
    contact: Joi.string()
      .pattern(/(\(?\d{2}\)?\s)?(\d{4,5}\-?\d{4})/)
      .required(),
    address: Joi.string().required(),
  })

  const { error } = checkoutSchema.validate(req.body, { abortEarly: false })

  if (error) {
    const messages = error.details.map(({ message }) => message).join(", ")
    return res.status(422).send(messages)
  }

  next()
}

export { checkoutValidation };