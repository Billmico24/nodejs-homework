import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

const authenticateToken = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    next(httpError(401, "Not authorized"));
    return;
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || user.token !== token) {
      next(httpError(401, "Not authorized"));
      return;
    }
    req.user = user;
    next();
  } catch {
    next(httpError(401, "Not authorized"));
  }
};

export { authenticateToken };
