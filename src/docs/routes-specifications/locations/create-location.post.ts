const requestSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      description:
        'The name of the location. It should have at least 2 letters.',
    },
  },
  example: {
    name: 'Restaurant',
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the location was created or not.',
    },
    data: {
      type: 'object',
      description: 'Encapsulates the API response.',
      properties: {
        locationId: {
          type: 'string',
          description: 'The id that was generated for the new location.',
        },
      },
    },
  },
  example: {
    success: true,
    data: {
      locationId: '26cac0ce-7e10-4384-bf0c-2d7e5d9ba68d',
    },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the location was register or not.',
    },
    error: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'A message that tells what is wrong with the request.',
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
  tags: ['Locations'],
  summary: 'Register a new location in the application.',
  security: [{ bearer: [] }],

  requestBody: {
    description: 'The expected params for create a new location.',
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },

  responses: {
    201: {
      description: 'Returns the id of the new location.',
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

    403: {
      description: `Inform that the admin's credentials are missing or invalid.`,
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    409: {
      description: 'Inform that the location is already registered.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    500: {
      description: 'Inform the occurrence of an internal server error.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  },
};
