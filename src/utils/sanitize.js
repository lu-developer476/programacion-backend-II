export const sanitizeUser = (user) => {
  const source = typeof user?.toObject === 'function' ? user.toObject() : user;
  if (!source) return null;

  const { password, __v, ...safeUser } = source;
  return safeUser;
};
