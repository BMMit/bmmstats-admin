export const generateID = () => {
  let newDate = new Date();
  const date = newDate
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/[^0-9]/g, "");
  const time = newDate.getTime().toString();
  return date + time;
};