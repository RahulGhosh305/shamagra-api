const nextMonday = async () => {
    const currentDate = new Date();
    if (currentDate.getDay() === 1) {
        return "Today";
    } else {
        const daysUntilNextMonday = (1 - currentDate.getDay() + 7) % 7;
        const nextMondayDate = new Date(currentDate);
        nextMondayDate.setDate(currentDate.getDate() + daysUntilNextMonday);

        const dayOfMonth = nextMondayDate.getDate();
        const ordinalSuffix = (dayOfMonth >= 11 && dayOfMonth <= 13) ? 'th' :
            ['st', 'nd', 'rd'][dayOfMonth % 10 - 1] || 'th';

        return `${dayOfMonth}${ordinalSuffix} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMondayDate)} ${nextMondayDate.getFullYear()}`;
    }
};

const nextThursday = async () => {
    const currentDate = new Date();
    if (currentDate.getDay() === 4) { // Thursday is represented by 4
        return "Today";
    } else {
        const daysUntilNextThursday = (4 - currentDate.getDay() + 7) % 7;
        const nextThursdayDate = new Date(currentDate);
        nextThursdayDate.setDate(currentDate.getDate() + daysUntilNextThursday);

        const dayOfMonth = nextThursdayDate.getDate();
        const ordinalSuffix = (dayOfMonth >= 11 && dayOfMonth <= 13) ? 'th' :
            ['st', 'nd', 'rd'][dayOfMonth % 10 - 1] || 'th';

        return `${dayOfMonth}${ordinalSuffix} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextThursdayDate)} ${nextThursdayDate.getFullYear()}`;
    }
};

const shortDate = (date: any) => {
    return (new Date(date)).toLocaleString('en-BD', {year: 'numeric', month: 'short', day: 'numeric'})
}

const groupByDate = (array: any[], key: string) => {
    const notifications = array.reduce((result, item) => {
        const groupKey = shortDate(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});

    const arr = [] as any;
    Object.keys(notifications).forEach((item) => arr.push({
        date: item,
        data: notifications[item]
    }))

    return arr;
}

export {nextMonday, nextThursday, shortDate, groupByDate};
