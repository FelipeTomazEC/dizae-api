const requestSchema = {
  type: 'object',
  required: ['avatar', 'email', 'password', 'name'],
  properties: {
    name: {
      type: 'string',
      description: `The admin's name. It should have at least 3 letters`,
    },
    email: {
      type: 'string',
      description: `The admin's e-mail.`,
    },
    password: {
      type: 'string',
      description: `The admin's password. It should have at least 6 characters, 1 numeric character, 1 special symbol.`,
    },
    avatar: {
      type: 'string',
      description: `A URL to the admin's avatar image.`,
    },
  },
  example: {
    avatar:
      'https://observatoriodocinema.uol.com.br/wp-content/uploads/2019/07/neytiri_in_avatar_2-wide-do-we-really-need-avatar-2.jpeg',
    email: 'admin@example.com',
    name: 'Admin Name',
    password: 'Some pas$w0rd',
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Flag that indicates wether the admin is registered or not.',
    },
    data: {
      type: 'object',
      properties: {
        adminId: {
          type: 'string',
          description: 'The uuid generated to the new admin.',
        },
      },
    },
  },
  example: {
    success: true,
    data: {
      adminId: `9f5f0472-539f-4242-ac47-284a8dcf17be`,
    },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the reporter was register or not.',
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
  post: {
    tags: ['Admins'],
    summary: 'Register a new admin in the system.',

    requestBody: {
      description: 'The expected params for create an admin.',
      required: true,
      content: {
        'application/json': {
          schema: requestSchema,
        },
      },
    },

    responses: {
      200: {
        description: 'Returns the id of the new admin.',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },

      400: {
        description: 'Inform if there is something wrong with the request.',
        content: {
          'application/json': {
            schema: errorSchema,
          },
        },
      },

      409: {
        description: 'Inform that the given e-mail is already registered.',
        content: {
          'application/json': {
            schema: errorSchema,
          },
        },
      },
    },
  },
};
