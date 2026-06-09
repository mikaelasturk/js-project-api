// Valideringsfunktioner för användare och tankar
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function validateRequired(fields, body) {
  const errors = {};
  fields.forEach(field => {
    if (!body[field]) {
      errors[field] = `${field} måste anges`;
    }
  });
  return errors;
}
