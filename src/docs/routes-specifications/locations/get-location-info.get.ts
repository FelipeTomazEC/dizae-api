const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates if the request was attended successfully.',
    },
    data: {
      name: {
        type: 'string',
      },
      createdAt: {
        type: 'number',
        description: 'A timestamp that represents when the location created.',
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'The name of the category which the item belongs.',
            },
            createdAt: {
              type: 'number',
              description:
                'A timestamp that represents when the item was first added.',
            },
            name: {
              type: 'string',
              description: 'The item name',
            },
            image: {
              type: 'string',
              description: `An URL to the item's image.`,
            },
          },
        },
      },
    },
  },

  example: {
    success: true,
    data: {
      name: 'Lobby',
      createdAt: 1621656920571,
      items: [
        {
          createdAt: 1621656920571,
          category: 'Infrastructure',
          name: 'Chair',
          image: 'http://images.com/chair.jpg',
        },
        {
          createdAt: 1621656920575,
          category: 'Technology',
          name: 'Computer',
          image: 'http://images.com/computer.jpg',
        },
        {
          createdAt: 1621656520571,
          category: 'Infrastructure',
          name: 'Table',
          image: 'http://images.com/table.jpg',
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
  summary: 'Returns all info about the specified location and its items.',
  parameters: [
    {
      in: 'path',
      name: 'location_id',
      required: true,
      type: 'uuid',
      description: 'The uuid of the location.',
    },
  ],

  responses: {
    200: {
      description: 'Returns all info about the specified location.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },

    404: {
      description: 'Informs that there is not location with the specified id.',
      content: {
        'application/json': {
          schema: errorSchema,
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
