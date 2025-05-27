

import { Router, RequestHandler } from 'express';
import { loginController, logoutController, refreshController, registerController } from '../controller/auth_controller';


const authRouter = Router();
authRouter.post("/register", registerController as RequestHandler);
authRouter.post("/login", loginController as RequestHandler);
authRouter.post("/refresh", refreshController as RequestHandler);
authRouter.get("/logout", logoutController as RequestHandler);

 export default authRouter;