import express from 'express';
import {registerUser, loginUser, deleteUser, updateUser, logoutUser, getUserDetails, authMiddleware, validateSessionRoute} from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/api/account", authMiddleware, getUserDetails);
userRouter.put("/api/update", authMiddleware, updateUser);
userRouter.delete("/api/delete", authMiddleware, deleteUser);
userRouter.post("/api/logout", authMiddleware, logoutUser);

userRouter.get("/session-validate", validateSessionRoute);

export default userRouter;