export const retryFetch = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Only retry on server errors (status code 500-599)
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      if (retries <= 0) throw error;

      console.log(
        `API call failed with status ${error?.response?.status}. Retrying in ${delay}ms...`
      );

      // Wait for the specified delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Recursive call with one less retry
      return retryFetch(fn, retries - 1, delay * 1.5); // Exponential backoff
    }

    // For non-500 errors, just throw immediately
    throw error;
  }
};
