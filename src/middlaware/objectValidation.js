
import { objectId } from "../db/mongodb.js"

 const isValidId = (id) => {
  if (id && objectId.isValid(id))
    if (String(new objectId(id)) === id) return true

  return false
}

export { isValidId };