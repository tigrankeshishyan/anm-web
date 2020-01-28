import { isEmail, isCorrectPassword } from 'helpers';

export const validateForm = (formData, keys = [], translator) => {
  const errors = {};

  keys
    .forEach((key) => {
      const val = formData[key];

      if (!val || (val && !val.trim())) {
        errors[key] = `${translator(`form.${key}`)} ${translator('form.isRequired')}`;
      }

      if (key === 'email' && !isEmail(val)) {
        errors[key] = translator('email.wrongEmail');
      }

      if (key === 'password' && val && !isCorrectPassword(val)) {
        errors[key] = translator('password.wrongPassword');
      }
    });

  return errors;
};
