const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates if the request was attended successfully.',
    },
    data: {
      items: {
        type: 'array',
        categories: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            createdAt: {
              type: 'number',
              description:
                'A timestamp indicating when the item category was created.',
            },
          },
        },
      },
    },
  },

  example: {
    success: true,
    data: {
      categories: [
        { name: 'Infrastructure', createdAt: 1621662324421 },
        { name: 'Technology', createdAt: 1621662281315 },
        { name: 'Other', createdAt: 1621662281315 },
      ],
    },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Flag that indicates that the request failed.',
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
  tags: ['Item Categories'],
  summary: 'Returns all item categories registered in the API.',
  responses: {
    200: {
      description:
        'Contains an array with all item categories registered in the API.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },

    500: {
      description: 'Indicates the occurrence of some internal error.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  },
};
