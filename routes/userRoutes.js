const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(verifyJWT, usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(verifyJWT, usersController.updateUser);

router
  .route("/single/:id")
  .delete(verifyJWT, usersController.deleteUser)
  .get(verifyJWT, usersController.getSingleUser);

module.exports = router;
