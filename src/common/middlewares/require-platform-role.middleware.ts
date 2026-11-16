import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '@/modules/user/constants/user.constants';

import { ForbiddenException } from '@/common/exceptions';
import { exists } from '@/common/libs/exists';

export function requirePlatformRole(role: UserRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const isForbidden = !exists(req.user) || req.user.role !== role;

    if (isForbidden) {
      throw new ForbiddenException('Insufficient platform role');
    }

    next();
  };
}
