
import moment from 'moment';

export class DateUtils {
    private static current: moment.Moment = moment();

    public init(current: moment.Moment | string | Date = moment()): void {
        DateUtils.current = moment(current);
    }

    public getCurrentDate(): moment.Moment {
        return DateUtils.current.clone().startOf('day');
    }

    public getCurrentTime(): moment.Moment {
        return DateUtils.current.clone();
    }
}