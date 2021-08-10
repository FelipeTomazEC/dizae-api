import { Status } from '@entities/report/status';

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates if the request was attended successfully.',
    },
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'uuid',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        status: {
          type: 'number',
          description: `A value that indicates the report's status. It can be 1(PENDING), 2(REJECT) and 3(SOLVED).`,
        },
        createdAt: {
          type: 'number',
          description: 'A timestamp indicating when the report was registered.',
        },
        updatedAt: {
          type: 'number',
          description:
            'A timestamp indicating the last time the report was updated.',
        },
        image: {
          type: 'string',
          description:
            'An URL to the image attached by the reporter to this report.',
        },
        item: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the item which the report is related.',
            },
            location: {
              type: 'string',
              description: `The name of location where the report's item is located.`,
            },
          },
        },
        reporter: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            id: {
              type: 'uuid',
              description: 'The uuid that identifies the reporter.',
            },
            avatar: {
              type: 'string',
              description: `URL to the reporter's image.`,
            },
          },
        },
      },
    },
  },

  example: {
    success: true,
    data: {
      title: 'Broken chair',
      description: 'The chair 01, next of the entrance is broken.',
      image: 'http://www.image.com/broken-chair.jpg',
      status: Status.PENDING,
      createdAt: 1621961270026,
      updatedAt: 1621961272015,
      item: {
        name: 'Chair',
        location: 'Kitchen',
      },
      reporter: {
        name: 'Joseph Carl',
        id: '7d5e7ce7-44ed-40d0-9a46-646abb1911cd',
        avatar: 'https://avatar.com/joseph-carl.jpg',
      },
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
  tags: ['Reports'],
  summary:
    'Returns the full information of a report registered in the application. If accessed by a reporter, only their reports are returned.',
  security: [{ bearer: [] }],
  parameters: [
    {
      in: 'path',
      name: 'report_id',
      required: true,
      description: 'The uuid of the report.',
      type: 'number',
      example: '7d6e9ce7-4fed-40d0-9a78-546abb1911cd',
    },
  ],
  responses: {
    200: {
      description: 'Contains the information about the requested report.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },

    403: {
      description:
        'It is returned when no token (Reporter or Admin) is provided or the reporter is not the owner of the report.',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    404: {
      description:
        'It is returned when no report is found in the database with the given id.',
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
