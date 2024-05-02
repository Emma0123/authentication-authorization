const router = require("express").Router();
const { usersController } = require("../controllers");
const jwt = require("jsonwebtoken")
const { validateRegis, validateToken } = require("../middleware/validation");

router.get("/", (req, res, next) => {}, usersController.getData);
router.post("/regis", validateRegis, 
usersController.register)
router.post("/login", usersController.login)
router.get("/keeplogin", validateToken, usersController.keepLogin)
router.post("/check", usersController.checkWhoLogin)
router.post("/forgot-pass", usersController.requestPasswordReset)
router.post("/reset", usersController.resetPassword)


module.exports = router;