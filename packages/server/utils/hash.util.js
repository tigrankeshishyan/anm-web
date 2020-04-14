import bcrypt from 'bcrypt';

const saltWorkFactor = 10;

export async function generateHash (text) {
  const salt = await bcrypt.genSalt(saltWorkFactor);
  return bcrypt.hash(text, salt);
}

export async function passwordMaker (text) {
  if ((text || '').length < 8) {
    throw Error('password must have at least 8 characters');
  }
  return generateHash(text);
}

export async function compareHash (text, hash) {
  return bcrypt.compare(text, hash);
}
