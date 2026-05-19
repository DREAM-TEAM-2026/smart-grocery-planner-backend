import 'dotenv/config';

import { jwtVerify, createRemoteJWKSet } from 'jose';
import InvariantError from '../errors/invariant-error.js';

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEON_AUTH_URL}/.well-known/jwks.json`),
);

const TokenManager = {
  verifyNeonToken: async (bearerToken) => {
    try {
      const { payload } = await jwtVerify(bearerToken, JWKS, {
        issuer: new URL(process.env.NEON_AUTH_URL).origin,
      });

      return { user: payload };
    } catch (error) {
      console.log('Token validation failed:', error);
      throw new InvariantError('Token tidak valid atau sesi telah berakhir');
    }
  },
};

export default TokenManager;
