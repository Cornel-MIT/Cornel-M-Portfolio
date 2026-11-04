export const skillGroups = [
  {
    id: 'languages-frameworks', title: 'Languages & frameworks', icon: '🧩',
    items: ['C#', '.NET Core', 'JavaScript', 'TypeScript', 'Python', 'React', 'React Native', 'Angular'],
  },
  {
    id: 'cloud-devops', title: 'Cloud & DevOps', icon: '☁️',
    items: ['AWS', 'Azure', 'Firebase', 'CI/CD', 'Vercel', 'Render'],
  },
  {
    id: 'databases', title: 'Databases', icon: '🗄️',
    items: ['SQL Server', 'MongoDB', 'DynamoDB', 'MariaDB'],
  },
  {
    id: 'tools-apis', title: 'Tools & APIs', icon: '🛠️',
    items: ['REST APIs', 'Postman', 'Git', 'Figma', 'Visual Studio', 'VS Code', 'Trello', 'Jira'],
  },
  {
    id: 'other', title: 'Other', icon: '✳️',
    items: ['Salesforce (Ranger)', 'JSON Server'],
  },
]

export const allSkills = skillGroups.flatMap((group) => group.items)

export const skillRatings = {
  'C#': 82,
  '.NET Core': 80,
  JavaScript: 95,
  TypeScript: 84,
  Python: 80,
  React: 98,
  'React Native': 88,
  Angular: 76,
  AWS: 86,
  Azure: 75,
  Firebase: 87,
  'CI/CD': 78,
  Vercel: 85,
  Render: 80,
  'SQL Server': 76,
  MongoDB: 84,
  DynamoDB: 78,
  MariaDB: 75,
  'REST APIs': 88,
  Postman: 86,
  Git: 85,
  Figma: 80,
  'Visual Studio': 78,
  'VS Code': 94,
  Trello: 78,
  Jira: 78,
  'Salesforce (Ranger)': 80,
  'JSON Server': 75,
}

export const techStack = [
  'React', 'React Native', 'C#', 'JavaScript', 'TypeScript', 'Python',
  'AWS', 'Azure', 'Firebase', 'MongoDB', 'SQL Server', 'Git',
]
