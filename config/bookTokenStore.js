import crypto from 'crypto';

const tokenMap = new Map();
const TOKEN_EXPIRY_MS = 5 * 60 * 1000;

export const createToken = ({ bookId, userId, cloudUrl, filename }) => {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

  tokenMap.set(token, { bookId, userId, cloudUrl, filename, expiresAt });

  setTimeout(() => tokenMap.delete(token), TOKEN_EXPIRY_MS);

  return token;
};

export const getTokenData = (token) => {
  const data = tokenMap.get(token);
  if (!data || Date.now() > data.expiresAt) {
    tokenMap.delete(token);
    return null;
  }
  tokenMap.delete(token); // single-use
  return data;
};
