import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'typedash';
import { TranslationHelperService } from '../../../core/services/translate-helper.service';
import { DashboardTile } from './dashboard-tile';
import { Place } from '../../../core/store/florders/place.interface';

@Component({
  selector: 'app-dashboard-tile-depot',
  templateUrl: './tile-depot.html',
  styleUrls: ['./tile-depot.less', './dashboard-tile.less']
})
export class DepotTile extends DashboardTile implements OnChanges {

  private translatedWeekdays = [];
  private translatedUntil = 'UNTIL';
  openingHoursWeek: { days: number[], daysDescription: string, openingHours: string }[] = [];

  @Input() depots: Place[];
  private currentIndex: number = 0;

  get currentDepot(): Place {
    return this.depots && (this.currentIndex === 0 || this.currentIndex > 0) && this.currentIndex < this.depots.length && this.depots[this.currentIndex];
  }

  constructor(private translationHelperService: TranslationHelperService) {
    super();
    this.translatedWeekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    this.translationHelperService
    && this.translationHelperService
        .translateArrayToObject([...this.translatedWeekdays, 'UNTIL'], null, 'SHARED.DAYS.')
        .subscribe((translatedWeekdays: any) => {
          this.translatedWeekdays = this.translatedWeekdays.map(name => translatedWeekdays[name]);
          this.translatedUntil = translatedWeekdays['UNTIL'];
        });
  }

  ngOnInit(): void {
    this.initOpeningHoursWeeks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.depots && this.depots.length) {
      this.currentIndex = this.depots.findIndex(depot => depot.default);
      if (this.currentIndex < 0 && this.depots.length > 0) {
        this.currentIndex = 0;
      }
    }
  }

  initOpeningHoursWeeks() {
    this.currentDepot.openingHours && this.currentDepot.openingHours.forEach(oh => {
      const weekdayNr = _.indexOf(['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'], oh.weekday);
      const openingHours = oh.slots.reduce((result, slot, index) => {
        let r = '';
        if (index > 0) {
          r += ' | ';
        }
        r += `${slot.from} - ${slot.to}`;
        return result + r;
      },                                   '');

      let existingEntry = this.openingHoursWeek.find(ohw => ohw.openingHours === openingHours);
      if (!existingEntry) {
        existingEntry = {
          openingHours,
          daysDescription: '',
          days: []
        };
        this.openingHoursWeek.push(existingEntry);
      }
      existingEntry.days.push(weekdayNr);
    });


    this.openingHoursWeek.forEach(oh => {
      const days = [...oh.days];
      // Sort days so that adjacent days are together
      days.sort();
      // while (days.length > 2 && days.length < 7 && (days[days.length - 1] - days[0] + 7) % 7 === 1) {
      while (days.length > 1 && days.length < 7 && (days[0] - days[days.length - 1] + 7) % 7 === 1) {
        days.splice(0, 0, days[days.length - 1]);
        days.splice(days.length - 1, 1);
      }


      while (days.length > 0) {
        // Check for adjacent days
        const start = days[0];
        let end = days[0];
        days.find((d, i) => {
          if ((start + i) % 7 === d) {
            end = d;
            return false;
          } else {
            return true;
          }
        });
        if (start !== end) {
          if (oh.daysDescription.length > 0) oh.daysDescription += ', ';
          oh.daysDescription += this.translatedWeekdays[start] + ' ' + this.translatedUntil + ' ' + this.translatedWeekdays[end];
          days.splice(0, days.indexOf(end) + 1);
          continue;
        }
        // Non adjacent day
        if (oh.daysDescription.length > 0) oh.daysDescription += ', ';
        oh.daysDescription += this.translatedWeekdays[start];
        days.splice(0, 1);
      }
    });
  }

  previousDepot(): void {
    this.currentIndex -= 1;
    if (this.currentIndex === -1) {
      this.currentIndex = this.depots.length - 1;
    }
  }

  nextDepot(): void {
    this.currentIndex += 1;
    if (this.currentIndex === this.depots.length) {
      this.currentIndex = 0;
    }
  }
}
