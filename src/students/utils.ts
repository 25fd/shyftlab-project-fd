export function getDateDiffInYear(date: string) {
  const today = new Date();
  const dob = new Date(date);
  const diff = today.getTime() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
