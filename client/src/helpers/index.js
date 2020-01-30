export const emailReg = /\S+@\S+\.\S+/;
export const noop = () => {
};
export const isEmail = email => emailReg.test(email);
export const isWindowExists = () => typeof window !== 'undefined';
export const isCorrectPassword = pass => pass && pass.trim() && pass.trim().length >= 8;
export const findImageNodeByUrl = (images, url) => images.nodes.find((image) => image.id.includes(url));
