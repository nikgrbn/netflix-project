const userServices = require("../services/user");
const { errors } = require("../utils/consts");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "Secret key here sh...";

const authenticateUser = async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: errors.USERNAME_PASSWORD_REQUIRED });
  }
  console.log(req.body);


  // Call the authenticateUser function from userServices
  try {
    const user = await userServices.getUserByCredentials(username, password);
    if (!user) {
      return res.status(404).json({ error: errors.INVALID_CREDENTIALS });
    }
    try {
      const token = jwt.sign(
        {
          username: user.username,
          role: user.is_admin,
        },
        JWT_SECRET_KEY,
        { expiresIn: "1h" } // optional.
      );

      res.status(200).json({
        username: user.username,
        role: user.is_admin,
        token,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message  });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { authenticateUser };
