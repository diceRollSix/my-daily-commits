function getDateFromDateType(dateType) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    //TODO date type to constance

    let deyOfWeek = (date.getDay() === 0) ? 6 : (date.getDay() - 1);
    switch (dateType) {
        case '1':
            //start of current week
            date.setDate(date.getDate() - deyOfWeek - 7);
            break;
        case '2':
            //start of current week
            date.setDate(date.getDate() - deyOfWeek);
            break;
        case '3':
            //Yesterday
            date.setDate(date.getDate() - 1);
            break;
        case '4':
            //Today
            break;
    }

    return date.toISOString();
}

export {getDateFromDateType};
