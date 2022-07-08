import db from "../db/mongo.js";
import { ObjectId } from "mongodb";

export async function postProductToCart(req, res) {
  const { card } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "").trim();
  if (!token) return res.sendStatus(401);
  console.log(token);

  try {
    const session = await db
      .collection("sessions")
      .findOne({ token: token });
    const cart = await db
      .collection("users")
      .updateOne({ _id: ObjectId(session.id) }, { $push: { cart: card } });

    if (!card) {
      res.sendStatus(404);
      return;
    }
    res.send(cart);
  } catch (e) {
    res.sendStatus(e);
  }
}

export async function getCart(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "").trim();
  if (!token) return res.sendStatus(401);

  try {
    const session = await db
      .collection("sessions")
      .findOne({ token: token });
    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(session.id) });

    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.send(user.cart);
  } catch (e) {
    res.sendStatus(500);
  }
}

export async function postBuyCards(req, res) {
  const { cards } = req.body;
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "").trim();
  if (!token) return res.sendStatus(401);
  console.log(token);

  try{
    const session = await db.collection("sessions").findOne({ token: token });
    const owned = await db.collection("users").updateOne({ _id: ObjectId(session.id) }, { $push: { owned: cards } });
    if (!cards) {
      res.sendStatus(404);
      return;
    }
    res.send(owned);
  }catch(e){
    res.sendStatus(e)
  }
}

export async function getOwnedCards(req,res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim()
      if (!token) return res.sendStatus(401)

      try{
        const session = await db.collection("sessions").findOne({token: token});
        const user= await db.collection("users").findOne({_id:ObjectId(session.id)});
        if(!user){
            res.sendStatus(404);
            return;
        }
        res.send(user.owned)
        
      }catch(e){
        res.sendStatus(500);
      }
      //adicionar isso depois removo o comentario
}