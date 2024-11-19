export function getCurrentDateInfo() {
    const today = new Date();

    // 요일 계산 (0: 일요일 ~ 6: 토요일)
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const day = dayNames[today.getDay()];

    // 연도 계산
    const year = today.getFullYear();

    // 학기 계산 (1월~6월: 1학기, 7월~12월: 2학기)
    const semester = today.getMonth() < 6 ? 1 : 2;

    return {
      day,
      year,
      semester,
    };
  }

export const formatDateDiff = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // 밀리초 단위 차이
  const diffTime = Math.abs(now.getTime() - date.getTime());

  // 시간 단위 변환 상수
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  // 1년 이상 지났는지 확인
  if (diffTime >= year) {
    return date.toISOString().split('T')[0];
  }

  // 하루 이상 지났는지 확인
  if (diffTime >= day) {
    const days = Math.floor(diffTime / day);
    return `${days}일 전`;
  }

  // 1시간 이상 지났는지 확인
  if (diffTime >= hour) {
    const hours = Math.floor(diffTime / hour);
    return `${hours}시간 전`;
  }

  // 1분 이상 지났는지 확인
  if (diffTime >= minute) {
    const minutes = Math.floor(diffTime / minute);
    return `${minutes}분 전`;
  }

  // 1분 미만
  return '방금 전';
};
