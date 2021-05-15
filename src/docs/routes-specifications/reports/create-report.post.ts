const requestSchema = {
  type: 'object',
  required: ['description', 'image', 'itemName', 'locationId', 'title'],
  properties: {
    description: {
      type: 'string',
      description:
        'Description about the report. It should have a maximum of 120 characters.',
    },
    image: {
      type: 'string',
      description: 'An URL to the image of what is being reported.',
    },
    itemName: {
      type: 'string',
      description: 'Name of the item related to the report.',
    },
    locationId: {
      type: 'string',
      description: 'Id of the location where the item is located.',
    },
    title: {
      type: 'string',
      description:
        'Title of the report. It should have a minimum of 5 characters and a maximum of 25 characters.',
    },
  },

  example: {
    description: 'The chair situated next to the computer is broken.',
    image: 'http://www.images.com/broken-chair.jpg',
    itemName: 'Chair',
    locationId: '33389f61-df55-4934-adf5-2aeb65ec7f88',
    title: 'Broken chair',
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the report was registered or not.',
    },
    data: {
      newReportId: {
        type: 'string',
        description: 'Id of the new report.',
      },
    },
  },

  example: {
    success: true,
    data: {
      newReportId: '7dc8fec8-3d5c-463b-bfc9-ba5a539cb01b',
    },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description:
        'Flag that indicates wether the report was registered or not.',
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
  summary: 'Register a new report.',
  security: [{ bearer: [] }],

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
      description: 'Inform that the report was registered successfully.',
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
      description: `Inform that the reporter's credentials are missing or invalid.`,
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    404: {
      description: 'Inform if the location or item were not found.',
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
