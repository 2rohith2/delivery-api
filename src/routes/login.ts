import logger from '../middleware/logger';
import { Request, Response } from 'express';
import { Router } from 'express';
import { authorizeUser } from '../middleware/auth';
import { getUserByEmail, getUserDetailsByEmail } from '../database';

const loginRouter = Router();

loginRouter.post('/', (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const userDetails = getUserByEmail(email);

  if (userDetails) {
    const isUserWithValidCredentials = userDetails.password === password;

    if (isUserWithValidCredentials) {
      const userDetails = getUserDetailsByEmail(email);
      const tokens = authorizeUser(userDetails.id, email, userDetails.role);
      logger.log({ level: 'info', message: `${userDetails.role} token crated for user with email - ${email}` });
      res.json({
        email: userDetails.email,
        role: userDetails.role,
        name: userDetails.first_name,
        ...tokens
      });

    } else {
      res.status(401).send({ code: 401, message: 'Invalid credentials' });
    }
  } else {
    res.status(401).send({ code: 401, message: 'Invalid credentials' });
  }

});

export default loginRouter;