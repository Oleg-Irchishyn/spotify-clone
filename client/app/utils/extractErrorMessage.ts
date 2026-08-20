import axios from 'axios';

const extractErrorMessage = (
  error: unknown,
  fallback = 'Server error',
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      { message?: string | string[] } | undefined;

    if (typeof data?.message === 'string') {
      return data.message;
    }

    if (Array.isArray(data?.message) && data.message.length > 0) {
      return data.message.join(', ');
    }
  }

  return error instanceof Error ? error.message : fallback;
};

export { extractErrorMessage };
