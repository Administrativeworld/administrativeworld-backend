import employee from "../json/EmployessData.js";

export const getTeamMembers = (req, res) => {
  return res.json(employee);
};
