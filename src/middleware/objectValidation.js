import { ObjectId } from "mongodb"

export const isValidId = (id) => {
  if (id && ObjectId.isValid(id))
    if (String(new ObjectId(id)) === id) return true

  return false
}
