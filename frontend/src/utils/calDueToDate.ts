export function calDueToDate(targetString: string): string {
  const formattedDate = targetString.replace(/\./g, '-');

  // 날짜를 00:00:00 기준으로 맞추기
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(formattedDate);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'D-Day';
  }

  // 미래 날짜
  if (diffDays > 0) {
    return `D-${diffDays}`;
  }

  // 과거 날짜
  return `D+${Math.abs(diffDays)}`;
}
