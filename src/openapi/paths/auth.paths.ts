import { getMeResponseSchema } from '@/modules/auth/schemas/endpoints/get-me.schema';
import {
  loginRequestBodySchema,
  loginResponseSchema,
} from '@/modules/auth/schemas/endpoints/login.schema';
import { logoutResponseSchema } from '@/modules/auth/schemas/endpoints/logout.schema';
import { refreshResponseSchema } from '@/modules/auth/schemas/endpoints/refresh.schema';
import {
  registerRequestBodySchema,
  registerResponseSchema,
} from '@/modules/auth/schemas/endpoints/register.schema';

import { registry } from '@/openapi/registry-instance';
import { apiResponseSchema } from '@/openapi/schemas/shared.schema';

const getMeApiResponseSchema = apiResponseSchema(
  getMeResponseSchema,
  'GetMeApiResponse',
);

const registerApiResponseSchema = apiResponseSchema(
  registerResponseSchema,
  'RegisterApiResponse',
);

const loginApiResponseSchema = apiResponseSchema(
  loginResponseSchema,
  'LoginApiResponse',
);

const refreshApiResponseSchema = apiResponseSchema(
  refreshResponseSchema,
  'RefreshApiResponse',
);

const logoutApiResponseSchema = apiResponseSchema(
  logoutResponseSchema,
  'LogoutApiResponse',
);

const userExample = {
  id: '0190f5a3-0000-7000-8000-000000000001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  imageUrl: null,
  role: 'user',
  createdAt: '2024-07-01T12:00:00.000Z',
  updatedAt: null,
};

const accessTokenExample = 'eyJhbGciOiJIUzI1NiJ9.access.token';

const registerBodyExample = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePass1!',
  imageUrl: null,
};

const loginBodyExample = {
  email: 'john.doe@example.com',
  password: 'securePassword1',
};

registry.registerPath({
  method: 'get',
  path: '/api/v1/auth/me',
  summary: 'Get the current user',
  description:
    'Return the authenticated user profile. Requires a Bearer access token.',
  tags: ['auth'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Current user',
      content: {
        'application/json': {
          schema: getMeApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              user: userExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/register',
  summary: 'Register a new account',
  description:
    'Create a user account. Platform role is always user. Sign in separately to receive tokens.',
  tags: ['auth'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerRequestBodySchema,
          example: registerBodyExample,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Account created',
      content: {
        'application/json': {
          schema: registerApiResponseSchema,
          example: {
            code: 201,
            message: 'Success.',
            data: {
              user: userExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/login',
  summary: 'Log in',
  description:
    'Authenticate with email and password. Returns accessToken in JSON; sets httpOnly refreshToken cookie.',
  tags: ['auth'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginRequestBodySchema,
          example: loginBodyExample,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Authenticated (Set-Cookie: refreshToken)',
      content: {
        'application/json': {
          schema: loginApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              accessToken: accessTokenExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/refresh',
  summary: 'Refresh access token',
  description:
    'Rotate the refreshToken cookie and return a new accessToken. Requires the refreshToken cookie.',
  tags: ['auth'],
  security: [],
  responses: {
    200: {
      description: 'New access token (Set-Cookie: rotated refreshToken)',
      content: {
        'application/json': {
          schema: refreshApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              accessToken: accessTokenExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/logout',
  summary: 'Log out',
  description:
    'Revoke the refreshToken cookie row and clear the cookie. Missing or already-revoked cookies still succeed.',
  tags: ['auth'],
  security: [],
  responses: {
    200: {
      description: 'Logged out (Set-Cookie clears refreshToken)',
      content: {
        'application/json': {
          schema: logoutApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              loggedOut: true,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});
