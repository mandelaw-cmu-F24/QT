import 'dotenv/config';

export const isRunningInProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};
