import { REPORTER_AVATAR_BASE64_ENCODED } from './reporter-avatar-base64-encoded';

const requestSchema = {
  type: 'object',
  required: ['avatar', 'email', 'name', 'password'],
  properties: {
    name: {
      type: 'string',
      description:
        'The name of the reporter. It should have at least 3 letters.',
    },
    email: {
      type: 'string',
      description: 'A valid e-mail address.',
    },
    avatar: {
      type: 'string',
      description: 'An URL to the avatar of the reporter.',
    },
    password: {
      type: 'string',
      description:
        'A password for the reporter. It should have at least 6 characters, 1 special symbol and 1 numeric char.',
    },
  },
  example: {
    email: 'ash@pokemon.com',
    name: 'Ash Ketchum',
    password: 'pik@$h5',
    avatar: REPORTER_AVATAR_BASE64_ENCODED,
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the reporter was register or not.',
    },
    data: {
      type: 'object',
      description: 'Encapsulates the API response.',
      properties: {
        avatar: {
          type: 'string',
          description: `The URL of the new reporter's avatar.`,
        },
        reporterId: {
          type: 'string',
          description: 'The id that was generated for the new reporter.',
        },
      },
    },
  },
  example: {
    success: true,
    data: {
      avatar: 'https:www.images.com/reporter_avatar.jpeg',
      reporterId: '26cac0ce-7e10-4384-bf0c-2d7e5d9ba68d',
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
  tags: ['Reporters'],
  summary: 'Register a reporter in the application.',

  requestBody: {
    description: 'The expected params for register a new reporter.',
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },

  responses: {
    201: {
      description: 'Returns the id of the new reporter.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },

    400: {
      description: 'Returns what is wrong with the informed request.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    409: {
      description: 'Inform that the e-mail is already registered.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  },
};
