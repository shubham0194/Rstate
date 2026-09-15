const express = require("express");
const {getUsers,
       createUser,
       getUser,
       deleteUser,
       loginUser,
       googleLogin
      } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);

router.post("/", createUser);

router.get("/:id", getUser);

router.delete("/:id", deleteUser);

router.post("/login", loginUser);

router.post("/google", googleLogin);

module.exports = router;