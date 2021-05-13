const requestSchema = {
  type: 'object',
  required: ['adminId', 'categoryName', 'image', 'name'],
  properties: {
    adminId: {
      type: 'string',
      description: 'The id of the admin that is adding the new item.',
    },
    categoryName: {
      type: 'string',
      description: 'The category of the new item.',
    },
    image: {
      type: 'string',
      description: 'An URL to the image of the new item.',
    },
    name: {
      type: 'string',
      description: 'The name of the item. It should have at least 2 letters.',
    },
  },

  example: {
    adminId: '52ae07cc-c686-4606-beaa-4b3cf351be77',
    name: 'Door',
    categoryName: 'Infrastructure',
    image: 'http://imagens.com/door.jpg',
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the item added or not in the location.',
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
        'Flag that indicates wether the item was added or not in the location.',
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
    tags: ['Locations'],
    summary: 'Add a new item to a specific location.',
    security: [{ bearer: [] }],
    parameters: [
      {
        in: 'path',
        name: 'locationId',
        required: true,
        type: 'uuid',
        description: 'The uuid of the location where the item will be added.',
      },
    ],

    requestBody: {
      description: 'The expected params for add a new item.',
      required: true,
      content: {
        'application/json': {
          schema: requestSchema,
        },
      },
    },

    responses: {
      201: {
        description: 'Inform that the item was added successfully.',
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

      404: {
        description:
          'Inform if the admin, category or the location were not found.',
        content: {
          'application/json': {
            schema: errorSchema,
          },
        },
      },
    },
  },
};
