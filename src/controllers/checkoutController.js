import db from "../db/mongodb.js";
import { ObjectId } from "mongodb";

import  {isValidId} from "../middleware/objectValidation.js";

export const getCheckoutByCheckoutId = async (req, res) => {
  const { checkoutId } = req.params

  try {
    const { _id: userId } = res.locals.user

    const checkout = await db
      .collection("checkouts")
      .findOne({ _id: new ObjectId(checkoutId), status: { $ne: "removed" } })
    if (!checkout)
      return res.status(404).send("checkout, this checkout was not found.")

    if (JSON.stringify(checkout.userId) !== JSON.stringify(userId))
      return res.status(401).send("user, this user does not own this checkout.")

    res.send(checkout)
  } catch (e) {
    res.sendStatus(500)
    console.error(e)
  }
}

export const getCheckouts = async (req, res) => {
  try {
    const { _id: userId } = res.locals.user

    const allCheckouts = await db
      .collection("checkouts")
      .find({ userId: new ObjectId(userId), status: { $ne: "removed" } })
      .toArray()
    if (!allCheckouts)
      return res.status(404).send("checkout, no checkout found for this user.")

    res.send(allCheckouts)
  } catch (e) {
    res.sendStatus(500)
    console.error(e)
  }
}

export const postCheckoutByProductId = async (req, res) => {
  try {
    const { _id: userId, name } = res.locals.user
    const productId = req.params.productId
    const { paymentType, parcel = 1, contact, address } = req.body

    const conditionCart = {
      $and: [
        { userId: new ObjectId(userId) },
        { products: { $size: 1 } },
        { products: { $elemMatch: { productId } } },
        { checked: { $exists: false } },
      ],
    }

    const cart = await db.collection("cart").findOne(conditionCart)

    if (!cart)
      return res
        .status(404)
        .send("checkout, there are no products with this id in the cart.")

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) })

    if (!product)
      return res.status(404).send("product, this product does not exist.")

    if (
      product.available > 0 &&
      product.available >= cart.products[0].quantity
    ) {
      const quantity = cart.products[0].quantity

      await db.collection("products").findOneAndUpdate(
        {
          _id: new ObjectId(productId),
        },
        { $inc: { available: -parseInt(quantity) } },
      )

      const amount =
        paymentType === "ticket" ? product.price * 0.9 : product.price

      const newCheckout = {
        userId,
        name,
        paymentType,
        image: product.images,
        name: product.name,
        amount,
        products: { productId, quantity },
        parcel,
        contact,
        address,
        status: "pending",
      }

      delete cart._id

      await db.collection("checkouts").insertOne(newCheckout)
      await db
        .collection("cart")
        .updateOne(conditionCart, { $set: { ...cart, checked: true } })
      return res.status(201).send("checkout, successfully entered checkout.")
    }

    res.status(401).send("product, you don't have enough of this product")
  } catch (e) {
    res.sendStatus(500)
    console.error(e)
  }
}

export const postCheckout = async (req, res) => {
  try {
    const { _id: userId, name } = res.locals.user
    const { paymentType, parcel = 1, contact, address } = req.body

    const lastCart = await db
      .collection("cart")
      .find({ userId, checked: { $exists: false } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray()

    if (!lastCart.length)
      return res.status(404).send("checkout, there is no product in the cart.")

    const products = lastCart[0].products

    const ids = products.map(({ productId }) => new ObjectId(productId))
    const allProducts = await db
      .collection("products")
      .find({
        _id: { $in: ids },
      })
      .toArray()

    if (!allProducts)
      return res.status(404).send("products, there are no products.")

    for (let i = 0; i < allProducts.length; i++) {
      const productCondition =
        allProducts[i].available === 0 ||
        allProducts[i].available < products[i].quantity

      if (productCondition) {
        return res
          .status(401)
          .send(
            "products, there are not enough quantities of this product. productID " +
              allProducts[i]._id.toString(),
          )
      }
    }

    let amount = 0
    let quantityProducts = 0

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]

      quantityProducts += quantity

      const { price, images, name } = await db
        .collection("products")
        .findOne({ _id: new ObjectId(productId) })

      products[i].images = images
      products[i].name = name
      products[i].price = price
      amount += price

      await db.collection("products").findOneAndUpdate(
        {
          _id: new ObjectId(productId),
        },
        { $inc: { available: -parseInt(quantity) } },
      )
    }

    amount = paymentType === "ticket" ? amount * 0.9 : amount

    const { _id: lastCartId, ...othersInfo } = lastCart[0]

    const newCheckout = {
      userId,
      cartId: lastCartId,
      name,
      paymentType,
      images: null,
      name: null,
      amount,
      products,
      quantity: quantityProducts,
      parcel,
      contact,
      address,
      status: "pending",
    }

    await db.collection("checkouts").insertOne(newCheckout)
    await db.collection("cart").deleteOne({ _id: new ObjectId(lastCartId) })
    res.status(201).send("checkout, successfully entered checkout.")
  } catch (e) {
    res.sendStatus(500)
    console.error(e)
  }
}

export const deleteCheckoutByCheckoutId = async (req, res) => {
  const { checkoutId } = req.params

  if (!isValidId(checkoutId))
    return res.status(401).send("id, this id is invalid.")

  try {
    const checkout = await db
      .collection("checkouts")
      .findOne({ _id: new ObjectId(checkoutId), status: { $ne: "removed" } })

    if (!checkout)
      return res.status(404).send("checkout, this checkout does not exist")

    const { products } = checkout

    if (products.productId) {
      const { productId, quantity } = products

      const condition = { _id: new ObjectId(productId) }
      const updated = { $inc: { available: parseInt(quantity) } }

      await db.collection("products").updateOne(condition, updated)
    } else {
      for (let i = 0; i < products.length; i++) {
        const { productId, quantity } = products[i]

        const condition = { _id: new ObjectId(productId) }
        const updated = { $inc: { available: parseInt(quantity) } }

        await db.collection("products").updateOne(condition, updated)
      }
    }

    const { _id } = checkout
    await db
      .collection("checkouts")
      .updateOne({ _id: new ObjectId(_id) }, { $set: { status: "removed" } })
    res.send("checkout has been removed")
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}
