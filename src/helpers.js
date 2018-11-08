const DATE_TYPE = {
    PREVIOUS_WEEK: '1',
    CURRENT_WEEK: '2',
    YESTERDAY: '3',
    TODAY: '4',
    LAST_FRIDAY: '5',
};

/**
 * Date since by date type.
 *
 * @param dateType
 * @param returnDate
 *
 * @returns {string}
 */
function getSinceDateFromDateType(dateType, returnDate) {
    if (typeof returnDate === 'undefined') {
        returnDate = false;
    }

    let date = new Date();
    date.setHours(0, 0, 0, 0);

    let deyOfWeek = (date.getDay() === 0) ? 6 : (date.getDay() - 1);
    switch (dateType) {
        case DATE_TYPE.PREVIOUS_WEEK:
            //start of previous week
            date.setDate(date.getDate() - deyOfWeek - 7);
            break;
        case DATE_TYPE.LAST_FRIDAY:
            //start friday of previous week
            date.setDate(date.getDate() - deyOfWeek - 3);
            break;
        case DATE_TYPE.CURRENT_WEEK:
            //start of current week
            date.setDate(date.getDate() - deyOfWeek);
            break;
        case DATE_TYPE.YESTERDAY:
            //Yesterday
            date.setDate(date.getDate() - 1);
            break;
        case DATE_TYPE.TODAY:
            //Today
            break;
    }

    if (returnDate) {
        return date;
    }

    return date.toISOString();
}

/**
 * Date Until by date type.
 *
 * @param dateType
 * @param returnDate
 *
 * @returns {string}
 */
function getUntilDateFromDateType(dateType, returnDate) {
    if (typeof returnDate === 'undefined') {
        returnDate = false;
    }

    let date = new Date();

    let deyOfWeek = (date.getDay() === 0) ? 6 : (date.getDay() - 1);
    switch (dateType) {
        case DATE_TYPE.PREVIOUS_WEEK:
            //end of previous week
            date.setDate(date.getDate() - deyOfWeek - 1);
            date.setHours(23, 59, 59, 999);
            break;
        case DATE_TYPE.LAST_FRIDAY:
            //end friday of previous week
            date.setDate(date.getDate() - deyOfWeek - 3);
            date.setHours(23, 59, 59, 999);
            break;
        case DATE_TYPE.CURRENT_WEEK:
            //end of current week (Today)
            break;
        case DATE_TYPE.YESTERDAY:
            //end of yesterday
            date.setDate(date.getDate() - 1);
            date.setHours(23, 59, 59, 999);
            break;
        case DATE_TYPE.TODAY:
            //end of today
            break;
    }

    if (returnDate) {
        return date;
    }

    return date.toISOString();
}

function selectedDateTypeText(dateType) {
    console.log(dateType);
    switch (dateType) {
        case DATE_TYPE.TODAY:
            return 'Today';
        case DATE_TYPE.LAST_FRIDAY:
            return 'Last Friday';
        case DATE_TYPE.YESTERDAY:
            return 'Yesterday';
        case DATE_TYPE.CURRENT_WEEK:
            return 'Current Week';
        case DATE_TYPE.PREVIOUS_WEEK:
            return 'Previous Week';
    }

    return '';
}

export {getSinceDateFromDateType, getUntilDateFromDateType, DATE_TYPE, selectedDateTypeText};
