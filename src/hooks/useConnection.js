import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const useConnection = () => {
  const connection = axios.create({
    baseURL: 'http://localhost:3333',
  });

  return connection;
};
