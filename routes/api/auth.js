const express = require('express');
const ctrl = require("../../controllers/auth")

const router = express.Router();
const { validateBody, authenticate, upload } = require("../../middlewares");
const {schemas} = require("../../models/user");




router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch("/", authenticate, validateBody(schemas.updateSubscription), ctrl.updateSubscription)

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;

