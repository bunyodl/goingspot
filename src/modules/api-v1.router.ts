import { Router } from 'express';

import { authRouter } from '@/modules/auth/auth.route';
import { eventsRouter } from '@/modules/event/event.route';
import { usersRouter } from '@/modules/user/user.route';
import { venuesRouter } from '@/modules/venue/venue.route';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/venues', venuesRouter);
apiRouter.use('/users', usersRouter);

export default apiRouter;
