import fs from 'fs';
import path from 'path';

export const getTeamMembers = (req, res) => {
  const filePath = path.resolve('../json/EmployessData.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const employees = JSON.parse(rawData);
  res.json(employees);
};
