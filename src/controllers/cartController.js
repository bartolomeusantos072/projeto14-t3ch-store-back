import db from "../db/mongodb.js";
import { ObjectId } from "mongodb";

export const getCart = async (req, res) => {
	const userId = res.locals.user._id
	try {
		const cart = await db.collection("cart").findOne({ userId: userId })
		if (!cart) return res.status(404).send("Cart not found")
		const ids = cart.products.map(
			({ productId }) => new ObjectId(productId)
		)

		const products = await db
			.collection("products")
			.find({
				_id: { $in: ids },
			})
			.toArray()
		if (!products) return res.status(404).send("Products not found")

		const userCartProducts = products.map(product => {
			const cartProduct = cart.products.find(
				({ productId }) => productId === product._id.toHexString()
			)
			return {
				product: { ...product },
				quantity: cartProduct.quantity,
			}
		})
		res.send(userCartProducts)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
}

export const postProductToCart = async (req, res) => {
	const userId = res.locals.user._id
	const { productId, quantity } = req.body
	try {
		const products = await db.collection("products").findOne({
			_id: ObjectId(productId),
		})
		if (!products) return res.status(404).send("Product not found")
		if (products.available < quantity)
			return res.status(409).send("Product not available")

		const cart = await db
			.collection("cart")
			.findOne({ userId: ObjectId(userId) })
		if (!cart) {
			await db.collection("cart").insertOne({
				userId: ObjectId(userId),
				products: [{ productId, quantity }],
			})
		} else {
			const newProducts = {
				productId,
				quantity,
			}

			const quantityUpdate = await db
				.collection("cart")
				.findOneAndUpdate(
					{ userId: userId, "products.productId": productId },
					{ $inc: { "products.$.quantity": quantity } }
				)
			if (quantityUpdate.value)
				return res.send("Product quantity updated")

			await db
				.collection("cart")
				.updateOne(
					{ userId: userId },
					{ $set: { products: [...cart.products, ...[newProducts]] } }
				)
		}
		res.send("Product added to cart")
	} catch (error) {
		console.log(error)
		res.sendStatus(500)
	}
}

export const putQuantityOfCart = async (req, res) => {
	const userId = res.locals.user._id
	const { productId, quantity } = req.body
	try {
		const product = await db
			.collection("cart")
			.findOneAndUpdate(
				{ userId: userId, "products.productId": productId },
				{ $set: { "products.$.quantity": quantity } }
			)
		if (!product) return res.status(404).send("Product not found")
		res.send("Product quantity updated")
	} catch (error) {
		console.log(error)
		res.sendStatus(500)
	}
}

export const deleteProductFromCart = async (req, res) => {
	const userId = res.locals.user._id
	const { productId } = req.params
	try {
		const cart = await db.collection("cart").findOne({ userId: userId })
		if (!cart) return res.status(404).send("Cart not found")
		if (productId === "all") {
			await db.collection("cart").deleteOne({ userId: userId })
			return res.send("Cart deleted")
		}

		const newProducts = cart.products.filter(i => i.productId !== productId)
		await db
			.collection("cart")
			.updateOne(
				{ userId: userId },
				{ $set: { products: [...newProducts] } }
			)
		res.send("Product deleted from cart")
	} catch (error) {
		console.log(error)
		res.sendStatus(500)
	}
}
