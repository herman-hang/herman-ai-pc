import dayjs from 'dayjs';

export const formatDate = (dateTime: any) => {
    const now = dayjs();
    const date = dayjs(dateTime);
    const yesterday = now.subtract(1, 'day');
    const isSameDay = date.isSame(now, 'day');
    const isYesterday = date.isSame(yesterday, 'day');
    const isSameYear = date.isSame(now, 'year');

    if (isSameDay) {
        return date.format('HH:mm');
    } else if (isYesterday) {
        return `昨天 ${date.format('HH:mm')}`;
    } else {
        if (isSameYear) {
            return date.format('MM-DD HH:mm');
        } else {
            return date.format('YYYY-MM-DD HH:mm');
        }
    }
};