import { ITEM_BASE64_IMAGE_EXAMPLE } from './item-base64-image-example';

const requestSchema = {
  type: 'object',
  required: ['categoryName', 'image', 'name'],
  properties: {
    categoryName: {
      type: 'string',
      description: 'The category of the new item.',
    },
    image: {
      type: 'string',
      description: 'A Base64 encoded image.',
    },
    name: {
      type: 'string',
      description: 'The name of the item. It should have at least 2 letters.',
    },
  },

  example: {
    name: 'Door',
    categoryName: 'Infrastructure',
    image: ITEM_BASE64_IMAGE_EXAMPLE,
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
    data: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          description: 'An URL to the image of new item.',
        },
      },
    },
  },
  example: {
    success: true,
    data: {
      image: 'https://www.images.com/item_image.jpg',
    },
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
  tags: ['Locations'],
  summary: 'Add a new item to a specific location.',
  security: [{ bearer: [] }],
  parameters: [
    {
      in: 'path',
      name: 'location_id',
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
      description: 'Inform if the category or location were not found.',
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
