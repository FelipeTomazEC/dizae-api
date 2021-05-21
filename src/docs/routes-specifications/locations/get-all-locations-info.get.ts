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
        locations: {
          type: 'object',
          properties: {
            id: {
              type: 'uuid',
            },
            name: {
              type: 'string',
            },
            numberOfItems: {
              type: 'number',
              description:
                'Number of items that are registered in this location.',
            },
          },
        },
      },
    },
  },

  example: {
    success: true,
    data: {
      locations: [
        {
          id: '09ce91c2-21f0-41e0-b5cc-66b92753c4ac',
          name: 'Restaurant',
          numberOfItems: 15,
        },
        {
          id: '09ce91c2-21f0-41e0-b5cc-66b92753c4ad',
          name: 'Room 4',
          numberOfItems: 47,
        },
        {
          id: '09ce91c2-21f0-41e0-b5cc-66b92753c4ad',
          name: 'Lobby',
          numberOfItems: 101,
        },
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
  tags: ['Locations'],
  summary: 'Returns infos about all the locations registered in the API.',
  responses: {
    200: {
      description:
        'Contains an array with infos of all locations registered in the API.',
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
