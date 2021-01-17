const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../middleware/encrypt");
const models = require("../database/models/index");
const StatusCodes = require("../shared/constants/StatusCodes");

function createResponse(response, statusCode, message) {
  return response.status(statusCode).json({
    message: message,
    code: statusCode,
  });
}

//[TBD]
//log out the other user after registration (set cookie maxlife to 0)
//think of other use cases..

router.post("/register", async (req, res) => {

  // TODO: Replace with some more generic validation code, requires some further research.
  // Library to easily deserialize and/or verify probably also exists.
  
  if (req.body.username == null || req.body.password == null || req.body.email == null)
  {
    return createResponse(res, StatusCodes.BadRequest, "Missing fields.");
  }

  const email = req.body.email.toString().trim();
  const username = req.body.username.toString().trim();
  const password = req.body.password.toString().trim();

  if (username === "" || password === "" || email === "") 
  {
    // Should be handled by front-end process, but no harm in checking here.
    return createResponse(res, StatusCodes.BadRequest, "One or multiple fields are empty.");
  }
  try 
  {
    // Calls the Sequelize database; find one user with the matching username.
    const user = await models.User.findOne({
      where: { email: email },
    });

    if (user == null) 
    {
      const hashedPassword = await hashPassword(req.body.password);

      // This can return the created object, but unless we start using HATEOAS there's not much need for it.
      await models.User.create({
        email: email,
        username: username,
        password: hashedPassword,
      });

      return createResponse(res, StatusCodes.Created, "User created!");
    } else {
      return createResponse(res, StatusCodes.BadRequest, "E-mail already in use.");
    }

  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.InternalServerError).json("Unexpected error");
  }
});

module.exports = router;
