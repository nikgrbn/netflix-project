const userServices = require('../services/user');
const { errors }  = require('../utils/consts');
const { formatDocument } = require('../utils/helpers');

const signUpUser = async (req, res) => {
    const { username, password, display_name } = req.body;
    const picture = req.file ? req.file.path : undefined; // Use the uploaded file path if provided
  
    if (!username || !password) {
      return res.status(400).json({ error: errors.USERNAME_PASSWORD_REQUIRED });
    }
  
    try {
      const user = await userServices.createUser(username, password, picture, display_name);
      if (!user) {
        return res.status(400).json({ error: errors.USER_NOT_CREATED });
      }
 
      res.status(201).send();
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: errors.USERNAME_ALREADY_EXISTS });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
  

  const getUserById = async (req, res) => {
    // Extract user id from request parameters
    const { id } = req.params;

    try {
        // Retrieve user data from the database
        const user = await userServices.getUserById(id);

        if (user) {
            // Convert Mongoose document to plain JavaScript object
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password; // Remove sensitive password field

            // Construct the full profile picture URL
            userWithoutPassword.picture = user.picture
                ? `${req.protocol}://${req.get("host")}/${user.picture}`
                : `${req.protocol}://${req.get("host")}/uploads/users/default-picture.png`;

            res.status(200).json(formatDocument(userWithoutPassword));
        } else {
            res.status(404).json({ error: errors.USER_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { signUpUser, getUserById };