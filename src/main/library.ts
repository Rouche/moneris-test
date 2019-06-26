

import { DateUtils } from './modules/dateutils';
import momentimport from 'moment';
import { Moneris } from './modules/moneris';

export class Library {

    public static VERSION: string = '1.0.0';

    private static instance: Library = new Library();

    public dateUtils: DateUtils;
    public moneris: Moneris;
    public moment = momentimport;

    private constructor() {
        this.dateUtils = new DateUtils();
        this.moneris = new Moneris();
    }

    private static getInstance(): Library {
        console.info('Moneris library accessed. version : ' + Library.VERSION);

        return Library.instance;
    }
}