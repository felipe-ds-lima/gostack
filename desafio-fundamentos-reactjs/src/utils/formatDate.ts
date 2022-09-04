const formatDate = (date: Date): string => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export default formatDate;
