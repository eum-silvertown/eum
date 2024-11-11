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