

import { Router } from 'express';
import { loginController, logoutController, registerController } from '../controller/auth_controller';


const authRouter = Router();
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController)

 export default authRouter;