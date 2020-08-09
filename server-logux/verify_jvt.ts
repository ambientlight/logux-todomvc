import { readFileSync } from 'fs'
import { promisify } from 'util'
import * as path from 'path';
import * as jsonwebtoken from 'jsonwebtoken';
const jwkToPem = require('jwk-to-pem');
const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

export interface ClaimVerifyRequest {
  readonly token?: string;
}

export interface ClaimVerifyResult {
  readonly userName: string;
  readonly clientId: string;
  readonly isValid: boolean;
  readonly error?: any;
}

interface TokenHeader {
  kid: string;
  alg: string;
}
interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

let cacheKeys: MapOfKidToPublicKey | undefined = undefined
const getPublicKeys = (): MapOfKidToPublicKey => {
  if(cacheKeys){
    return cacheKeys
  }

  const publicKeys = JSON.parse(readFileSync(path.resolve(__dirname, 'jwks.json'), 'utf-8'));
  const keys = publicKeys.keys.reduce((agg: MapOfKidToPublicKey, current: PublicKey) => {
    const pem = jwkToPem(current);
    agg[current.kid] = {instance: current, pem};
    return agg;
  }, {} as MapOfKidToPublicKey);
  cacheKeys = keys
  return keys;
};

const cognitoIssuer = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USERPOOL_ID}`;

export const verifyToken = async (token: string): Promise<ClaimVerifyResult> => {
  try {
    const tokenSections = (token || '').split('.');
    if (tokenSections.length < 2) {
      throw new Error('requested token is invalid');
    }
    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON) as TokenHeader;
    const keys = getPublicKeys();
    const key = keys[header.kid];
    if (key === undefined) {
      throw new Error('claim made for unknown kid');
    }
    const claim = await verifyPromised(token, key.pem) as Claim;
    const currentSeconds = Math.floor( (new Date()).valueOf() / 1000);
    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error('claim is expired or invalid');
    }
    if (claim.iss !== cognitoIssuer) {
      throw new Error('claim issuer is invalid');
    }
    if (claim.token_use !== 'access') {
      throw new Error('claim use is not access');
    }
    return {userName: claim.username, clientId: claim.client_id, isValid: true};
  } catch (error) {
    console.error(error)
    return { userName: '', clientId: '', error, isValid: false }
  }
}