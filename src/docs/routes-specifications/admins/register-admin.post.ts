import { AVATAR_BASE64_ENCODED_EXAMPLE } from './avatar-base64-encoded-example';

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
      description: `A base64 encoded image.`,
    },
  },
  example: {
    email: 'admin@example.com',
    name: 'Admin Name',
    password: 'Some pas$w0rd',
    avatar: AVATAR_BASE64_ENCODED_EXAMPLE,
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
        avatar: {
          type: 'string',
          description: `The URL of the admin's avatar.`,
        },
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
      avatar: 'https:www.images.com/admin_avatar.jpeg',
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
    201: {
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
};
