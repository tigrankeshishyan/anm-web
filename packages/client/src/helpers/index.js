export const emailReg = /\S+@\S+\.\S+/;
export const noop = () => {
};
export const isEmail = email => emailReg.test(email);
export const isCorrectPassword = pass => pass && pass.trim() && pass.trim().length >= 8;
