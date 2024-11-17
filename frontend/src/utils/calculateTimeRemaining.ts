
export const calculateTimeRemaining = (targetDateString: string): string => {
    // 입력된 시간을 Date 객체로 변환
    const targetDate = new Date(targetDateString);
    const now = new Date();

    // 밀리초 단위로 차이 계산
    const diffInMs = targetDate.getTime() - now.getTime();

    // 음수면 이미 지난 시간
    if (diffInMs < 0) {
        return '기간 만료';
    }

    // 일, 시간, 분 계산
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
    const minutes = diffInMinutes % 60;

    // 하루 이상 남았을 경우
    if (days > 0) {
        return `${days}일 남음`;
    }

    // 당일인 경우
    if (hours > 0 && minutes > 0) {
        return `${hours}시간 ${minutes}분 남음`;
    } else if (hours > 0) {
        return `${hours}시간 남음`;
    } else if (minutes > 0) {
        return `${minutes}분 남음`;
    } else {
        return '1분 미만 남음';
    }
};