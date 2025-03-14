
export const getInterviewTypeLabel = (type: string) => {
  const types = {
    'online': 'Online Video Interview',
    'phone': 'Telephone Interview',
    'face-to-face': 'Face to Face Interview',
    'group': 'Group Interview',
    'assessment': 'Assessment Center',
    'technical': 'Technical Interview'
  };
  return types[type as keyof typeof types] || type;
};
