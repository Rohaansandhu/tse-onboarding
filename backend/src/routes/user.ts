/**
 * Task route requests.
 */

import express from "express";
import * as UserController from "src/controllers/user";
import * as UserValidator from "src/validators/user";

const router = express.Router();

router.get("/:id", UserController.getUser);

router.post("/", UserValidator.createUser, UserController.createUser);
// router.delete("/:id", UserController.removeTask);
// router.put("/:id", UserValidator.updateTask, UserController.updateTask);

export default router;
