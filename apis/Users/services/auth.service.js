const jwt = require("jsonwebtoken");
const database = require("../../../dbConfig/db/models");
require("dotenv").config();

const createToken = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const user = await database.AdminUsers.findOne({
      where: {
        email: email
      }
    });
    if (user) {
      if (user.password === password) {
        const payload = {
          email: email,
          name: name,
          role: role
        };
        const token = jwt.sign(payload, process.env.JWT_KEY);
        res.set("Authorization", token);
        res.status(204).send("Success");
      }
    } else {
      return res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const authMidClient = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      if (payload.role === "client") {
        return next();
      } else {
        return res.status(400).send("Invalid token");
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  } else {
    return res.status(401).send("Você não está autorizado.");
  }
};

const authMidEmployee = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      if (payload.role === "employee") {
        return next();
      } else {
        return res.status(400).send("Invalid token");
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  } else {
    return res.status(401).send("Você não está autorizado.");
  }
};

module.exports = {
  authMidClient,
  createToken,
  authMidEmployee
};
