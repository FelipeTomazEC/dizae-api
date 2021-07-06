import { Status } from '@entities/report/status';

const requestSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'number',
      description: `The new status of the report. It can be ${Status.REJECTED} (Rejected) or ${Status.SOLVED} (Solved).`,
    },
  },

  example: {
    status: Status.SOLVED,
  },
};

const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Flag that indicates wether the report was updated or not.',
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
      description: 'Flag that indicates wether the report was updated or not.',
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
  summary: 'Update the report properties.',
  security: [{ bearer: [] }],
  parameters: [
    {
      in: 'path',
      description: 'UUID of the report to be updated.',
      required: true,
      type: 'uuid',
      name: 'report_id',
    },
  ],

  requestBody: {
    description: 'The accepted report fields that can be updated.',
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },

  responses: {
    200: {
      description: 'Inform that the report was updated successfully.',
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
      description: `Inform that the credentials are missing or invalid.`,
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    404: {
      description: 'Inform if the informed report was not found.',
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
