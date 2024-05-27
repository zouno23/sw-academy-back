module.exports.RoleComparison = (role1, role2) => {
  const creator = RoleTransformation(role1);
  const createe = RoleTransformation(role2);
  return creator >= createe;
};

const RoleTransformation = (role) => {
  let result;
  switch (role) {
    case "Assistant":
      result = 0;
    case "Admin":
      result = 1;
    case "SuperAdmin":
      result = 2;
    default:
      result = 0;
  }
  return result;
};
