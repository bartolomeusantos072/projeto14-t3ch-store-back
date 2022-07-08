import  { db,  objectId } from '../db/mongodb.js';
import jwt from "jsonwebtoken";

export const validateToken = async (req, res, next) => {
	const { authorization } = req.headers
	const token = authorization?.replace("Bearer ", "").trim()

	if (!token)
		return res.status(401).send("token, required token for this service.")

	try {
		const secret = process.env.JWT_SECRET
		const data = jwt.verify(token, secret)
		const user = await db.collection("users").findOne({
			_id: new objectId(data.userId),
		})
		if (!user) return res.status(404).send("user, this user was not found.")

		const session = await db.collection("sessions").findOne({
			$and: [{ _id: new objectId(data.sessionId) }, { loggedIn: true }],
		})
		if (!session)
			return res.status(401).send("session, this session is invalid.")

		delete user.password

		res.locals.user = user
		res.locals.session = session

		next()
	} catch (e) {
		res.sendStatus(500)
		console.error(e)
	}
}
