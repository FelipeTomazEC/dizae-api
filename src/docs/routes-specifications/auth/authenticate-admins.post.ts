const requestSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      description: `The admin's e-mail.`,
    },
    password: {
      type: 'string',
      description: `The admin's password.`,
    },
  },
  example: {
    email: 'admin@example.com',
    password: 'Some pas$w0rd',
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Flag that indicates wether the login is successful or not.',
    },
    data: {
      type: 'object',
      properties: {
        credentials: {
          type: 'string',
          description:
            'A json web token that can be used in protected admin routes.',
        },
        expiresIn: {
          type: 'number',
          description: 'The expiration time of the token in seconds.',
        },
      },
    },
  },
  example: {
    success: true,
    data: {
      credentials: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJvd25lcklkIjp7InByb3BzIjp7InZhbHVlIjoiMjlkNDJlZmItYzAyNy00MzAyLTg1MzUtNDQwNmRiNTFmNGRkIn19LCJpYXQiOjE2MTk5MDAzNjUsImV4cCI6MTYxOTkwMzk2NX0.5MQqTW3RaBhndGd-E7s2MtCvUxge_IAHIi_B5-7GlBc`,
      expiresIn: 3600,
    },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Flag that indicates wether the admin was register or not.',
    },
    error: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'A message that tells what was wrong.',
        },
      },
    },
  },
  example: {
    success: false,
    error: {
      message: 'Specific error message.',
    },
  },
};

export default {
  tags: ['Auth'],
  summary: 'Authenticate the admin in the application.',

  requestBody: {
    description: 'The expected params for authenticate an admin.',
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },

  responses: {
    200: {
      description: 'Returns a token for the admin.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },

    400: {
      description: 'Returns an error informing that the e-mail is not valid.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    401: {
      description: 'Returns an error informing that the password is wrong.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    404: {
      description: 'Inform that the given e-mail is not registered.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  },
};
