export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (date.toDateString() === today.toDateString()) {
    return `Сегодня, ${time}`;
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === yesterday.toDateString()) {
    return `Вчера, ${time}`;
  }
  
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 5) {
    return `${diffDays} дня назад, ${time}`;
  }
  
  return date.toLocaleDateString([], { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
};