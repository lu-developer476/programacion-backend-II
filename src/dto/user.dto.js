export const userDTO = (user) => {
  if (!user) return null;
  const source = typeof user.toObject === 'function' ? user.toObject() : user;
  const { password, __v, ...safe } = source;
  return safe;
};
