const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates if the request was attended successfully.',
    },
    data: {
      reports: {
        type: 'array',
        categories: {
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
              description:
                'A timestamp indicating when the report was registered.',
            },
            location: {
              type: 'string',
              description: `The name of location where the report's item is located.`,
            },
            item: {
              type: 'string',
              description: 'The name of the item which the report is related.',
            },
            image: {
              type: 'string',
              description:
                'An URL to the image attached by the reporter to this report.',
            },
            reporterName: {
              type: 'string',
            },
          },
        },
      },
    },
  },

  example: {
    success: true,
    data: {
      reports: [
        {
          createdAt: 1621961270026,
          description: 'The chair 01, next of the entrance is broken.',
          id: 'b234e50c-5d89-432d-bc30-a327ba7d3a28',
          image: 'http://www.image.com/broken-chair.jpg',
          item: 'Chair',
          location: 'Lobby',
          reporterName: 'Joseph Carl',
          status: 1,
          title: 'Broken chair',
        },
        {
          createdAt: 1621961270026,
          description: 'The chair 01, next of the entrance is broken.',
          id: 'b234e50c-5d89-432d-bc30-a327ba7d3a28',
          image: 'http://www.image.com/broken-chair.jpg',
          item: 'Chair',
          location: 'Lobby',
          reporterName: 'Robert Taz',
          status: 1,
          title: 'Broken chair',
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
  tags: ['Reports'],
  summary:
    'Returns the reports registered in the application. If accessed by a reporter, only their reports are returned.',
  security: [{ bearer: [] }],
  parameters: [
    {
      in: 'query',
      name: 'start',
      required: false,
      description:
        'The index of the first result. The default value is 0 (Zero).',
      type: 'number',
      example: 30,
    },
    {
      in: 'query',
      name: 'offset',
      required: false,
      description:
        'The number of items returned from the start. The max (and default) value is 50 (Fifty).',
      type: 'number',
      example: 15,
    },
    {
      in: 'query',
      name: 'locations_ids',
      required: false,
      description: `Comma separated values to filter reports by its item's location.`,
      type: 'string',
      example:
        '7d5e7ce7-44ed-40d0-9a46-646abb1911cd,7d6e9ce7-4fed-40d0-9a78-546abb1911cd',
    },
    {
      in: 'query',
      name: 'item_categories',
      required: false,
      description: `Comma separated values to filter reports by its item's category.`,
      type: 'string',
      example: 'Infrastructure,Electronics,Others',
    },
    {
      in: 'query',
      name: 'since',
      required: false,
      description: `Timestamp to filter reports that were created after the specified value.`,
      type: 'number',
      example: 1621983389655,
    },
  ],
  responses: {
    200: {
      description:
        'Contains an array with the reports that satisfies the specified filters.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },

    403: {
      description:
        'It is returned when no token (Reporter or Admin) is provided.',
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
