import z from 'zod';
import ValidationError from '@/core/validationError.class.js';


export function validateSafe(schema: z.ZodSchema, data: any) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const details = {};
    let errorMessage: string;
    result.error.issues.forEach((issue) => {
      details[issue.path[0]] = issue.message;
      if (!errorMessage) errorMessage = issue.message;
    });

    return { success: false, data: null, error: new ValidationError(errorMessage, details) };
  }

  return { success: true, data: result.data, error: null };
}


export function validate(schema: z.ZodSchema, data: any) {
  const result = validateSafe(schema, data);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
