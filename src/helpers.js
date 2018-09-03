/**
 * Date since by date type.
 *
 * @param dateType
 *
 * @returns {string}
 */
function getSinceDateFromDateType(dateType) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    //TODO date type to constance

    let deyOfWeek = (date.getDay() === 0) ? 6 : (date.getDay() - 1);
    switch (dateType) {
        case '1':
            //start of previous week
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

/**
 * Date Until by date type.
 *
 * @param dateType
 *
 * @returns {string}
 */
function getUntilDateFromDateType(dateType) {
    let date = new Date();

    //TODO date type to constance

    let deyOfWeek = (date.getDay() === 0) ? 6 : (date.getDay() - 1);
    switch (dateType) {
        case '1':
            //end of previous week
            date.setDate(date.getDate() - deyOfWeek - 1);
            date.setHours(23, 59, 59, 999);
            break;
        case '2':
            //end of current week (Today)
            break;
        case '3':
            //end of yesterday
            date.setDate(date.getDate() - 1);
            date.setHours(23, 59, 59, 999);
            break;
        case '4':
            //end of today
            break;
    }

    return date.toISOString();
}

export {getSinceDateFromDateType, getUntilDateFromDateType};
