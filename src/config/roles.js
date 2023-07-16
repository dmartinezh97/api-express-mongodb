const allRoles = {
  user: [ 'docs', 'getDocs'],
  admin: ['getUsers', 'manageUsers', 'docs', 'getDocs'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
