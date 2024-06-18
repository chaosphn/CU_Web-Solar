import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { PeriodTime } from '../models/period-time';

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    constructor(private datePipe: DatePipe) { }

    getDateTime(date: Date | string): string {
        if (typeof date === 'string') {
            const newDateTime = this.datePipe.transform(new Date(date), 'yyyy-MM-ddTHH:mm:ssZZZZZ');
            //const newDateTime = this.datePipe.transform(new Date(date), 'yyyy-MM-ddTHH:mm:ssZ', 'UTC');
            return newDateTime;
        }
        else if (date instanceof Date) {
            const newDateTime = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ssZZZZZ');
            //const newDateTime = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ssZ', 'UTC');
            return newDateTime;
        }
    }

    getDateTime1(date: Date | string): string {
        if (typeof date === 'string') {
            const newDateTime = this.datePipe.transform(new Date(date), 'yyyy-MM-dd HH:mm:ss');
            return newDateTime;
        }
        else if (date instanceof Date) {
            const newDateTime = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
            return newDateTime;
        }
    }
    getTime(period: string): string {
        const p = period.toLowerCase();
        if (p === 'boh') {
            const dateTime = new Date();
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'bod') {
            const dateTime = new Date();
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'bom') {
            const dateTime = new Date();
            dateTime.setDate(1);
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'boy') {
            const dateTime = new Date();
            dateTime.setMonth(0);
            dateTime.setDate(1);
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'eoh') {
            const dateTime = new Date();
            dateTime.setHours(dateTime.getHours() + 1);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'eod') {
            const dateTime = new Date();
            dateTime.setDate(dateTime.getDate() + 1);
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'eom') {
            const dateTime = new Date();
            dateTime.setMonth(dateTime.getMonth() + 1);
            dateTime.setDate(0);
            dateTime.setHours(23);
            dateTime.setMinutes(59);
            dateTime.setSeconds(59);
            dateTime.setMilliseconds(0);
            const month = new Date(this.getDateTime1(dateTime));
            // month.setSeconds(month.getSeconds() -1);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'eoy') {
            const dateTime = new Date();
            dateTime.setFullYear(dateTime.getFullYear() + 1);
            dateTime.setMonth(0);
            dateTime.setDate(1);
            dateTime.setHours(23);
            dateTime.setMinutes(59);
            dateTime.setSeconds(59);
            dateTime.setMilliseconds(0);
            const year = new Date(this.getDateTime1(dateTime));
            year.setDate(year.getDate() -1);
            const dtres = this.getDateTime1(year);
            return dtres;
        }
        else if (p === 'now') {
            const dateTime = new Date();
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (p === 'y') {
            const dateTime = new Date();
            dateTime.setDate(dateTime.getDate() - 1);
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (/(\*).*/.test(period.toLowerCase())) {
            const regexNumber = /\d+\.?\d*/g;
            const regexUnit = /[a-z].*/g;
            const mNumber = period.toLowerCase().match(regexNumber);
            const mUnit = period.toLowerCase().match(regexUnit);
            if (mNumber.length > 0 && mUnit.length > 0) {
                const number = mNumber[0];
                const unit = mUnit[0];
                const dtres = this.parseSingleDateTime(unit, +number);
                return dtres;
        
            }
            return null;
        }
    }

    parseSingleDateTime(key: string, number: number = 0) {
        if (key === 't') {
            const dateTime = new Date();
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (key === 's') {
            const dateTime = new Date();
            dateTime.setSeconds(dateTime.getSeconds() - number);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (key === 'm') {
            const dateTime = new Date();
            dateTime.setMinutes(dateTime.getMinutes() - number);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (key === 'h') {
            const dateTime = new Date();
            dateTime.setHours(dateTime.getHours() - number);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (key === 'd') {
            const dateTime = new Date();
            dateTime.setDate(dateTime.getDate() - number);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (key === 'mo') {
            const dateTime = new Date();
            dateTime.setMonth(dateTime.getMonth() - number);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
        else if (key === 'y') {
            const dateTime = new Date();
            dateTime.setFullYear(dateTime.getFullYear() - number);
            const dtres = this.getDateTime1(dateTime);
            return dtres;
        }
    }

    parseDate(key: string): PeriodTime {
        const _key = key.toLocaleLowerCase();
        let period: PeriodTime = {};
        const now = new Date();

        if (_key.includes('t')) {
            period = {  
                startTime: this.getToday(),
                endTime: this.getTomorrow()
            };
        }
        else if (_key.includes('y')) {
            period = {  
                startTime: this.getYesterday(),
                endTime: this.getToday()
      
            };
        }
        else if (_key.includes('d')) {
            const numDate = parseFloat(key) + 1;
            const tomorrow = this.getTomorrow();
            period = {  
                startTime: this.getDateTime(this.getPreviousDate(numDate, tomorrow)),
                // endTime: this.getToday()
                endTime: this.getTomorrow()
            };
        }
        else if (_key.includes('m')) {
            const numMonth = parseFloat(key);
            const tomorrow = this.getTomorrow();

            period = {  
                startTime:  this.getDateTime(this.getPreviousMonth(numMonth, tomorrow)),
                // endTime: this.getToday()
                endTime: this.getDateTime(now)
            };
        }
        
        return period;
    }

    private getPreviousDate(numberDate: number, date: string): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - numberDate);
        return newDate;
    }

    private getPreviousMonth(numberMonth: number, date: string): Date {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - numberMonth);
        return newDate;
    }

    private getTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const dateTime = this.getDateTime(tomorrow);
        return dateTime;
    }

    private getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const dateTime = this.getDateTime(yesterday);
        return dateTime;
    }

    private getDate(numDate: number): Date {
        const date = new Date();
        return  new Date(date.setDate(date.getDate() - numDate));
    }

    private getMonth(numMonth: number): Date {
        const date = new Date();
        return  new Date(date.setMonth(date.getMonth() - numMonth));
    }

    private getDateToday(): Date {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }

    getToday(): string {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateTime = this.getDateTime(today);
        return dateTime;
    }


    getYesterDayLastTime(): string {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        yesterday.setMinutes(-1);
        const dateTime = this.getDateTime(yesterday);
        return dateTime;
    }
}
