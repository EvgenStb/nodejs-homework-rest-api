const express = require("express");


const router = express.Router();

const ctrl = require("../../controllers/contacts");

const {validateBody} = require("../../middlewares")
const {validateContact} = require("../../schemas/contacts")


router.get("/",ctrl.getAll );

router.get("/:contactId", ctrl.getById);

router.post("/",validateBody(validateContact),ctrl.add );

router.delete("/:contactId", ctrl.dellete);

router.put("/:contactId", validateBody(validateContact), ctrl.updateById);

module.exports = router;
