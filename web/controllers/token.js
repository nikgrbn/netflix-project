const userServices = require("../services/user");
const { errors } = require("../utils/consts");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
        JWT_SECRET_KEY
      );

      res.status(200).json({
        id: user._id,
        username: user.username,
        picture: user.picture,
        display_name: user.display_name,
        is_admin: user.is_admin,
        watched_movies: user.watched_movies,
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
