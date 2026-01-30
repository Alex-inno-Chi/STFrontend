export function formatDate(date: string): string {
  // const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const hours = new Date(date).getHours();
  const minutes = new Date(date).getMinutes();
  return `${hours}:${minutes}  ${day}-${month}`;
}

export function fullFormatDate(date: string): string {
  const D = new Date(date);
  return (
    ("0" + D.getDate()).slice(-2) +
    "." +
    ("0" + (D.getMonth() + 1)).slice(-2) +
    "." +
    D.getFullYear()
  );
}

export function calculateAge(birthday: string) {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
