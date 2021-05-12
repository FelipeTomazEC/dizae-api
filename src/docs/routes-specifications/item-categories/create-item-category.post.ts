const requestSchema = {
  type: 'object',
  required: ['adminId', 'name'],
  properties: {
    adminId: {
      type: 'string',
      description: 'The id of the admin that is creating the item category.',
    },
    name: {
      type: 'string',
      description:
        'The name of the item category. It should have at least 2 letters.',
    },
  },
  example: {
    adminId: '52ae07cc-c686-4606-beaa-4b3cf351be77',
    name: 'Restaurant',
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the item category was created or not.',
    },
  },
  example: {
    success: true,
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the item category was register or not.',
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
  post: {
    tags: ['Item Categories'],
    summary: 'Register a new item category in the application.',
    security: [{ bearer: [] }],

    requestBody: {
      description: 'The expected params for create a new item category.',
      required: true,
      content: {
        'application/json': {
          schema: requestSchema,
        },
      },
    },

    responses: {
      201: {
        description:
          'Returns the success flag indicating that the item category was created successfully.',
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
        description: 'Inform that the item category is already registered.',
        content: {
          'application/json': {
            schema: errorSchema,
          },
        },
      },
    },
  },
};
