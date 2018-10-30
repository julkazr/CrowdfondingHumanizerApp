import { Pipe, PipeTransform } from '@angular/core';
import { Event as AppEvent } from '../models/event.model';
import { Category } from '../models/category.model';

@Pipe({
  name: 'sortAndFilter',
  pure: false
})
export class SortAndFilterPipe implements PipeTransform {
  transform(
    value: AppEvent[] | null,
    onlyCurrent?: boolean,
    filterByCategory?: Category[],
    sortBy?: string,
    ascending?: boolean,
    filterByState?: string
  ): AppEvent[] {
    if (value !== null) {
      if (onlyCurrent) {
        value = value.filter(
          event =>
            event.startDate.getTime() + event.duration > new Date().getTime()
        );
      }
      if (filterByState) {
        value = value.filter(
          event => event.state === filterByState.toLocaleLowerCase()
        );
      }

      if (filterByCategory) {
        const filters = filterByCategory
          .filter(cat => cat.useFilter === true)
          .map(cat => cat.categoryID);
        if (filters && filters.length) {
          value = value.filter(
            event => filters.indexOf(event.categoryID) !== -1
          );
        }
      }
      if (!sortBy) {
        sortBy = 'startDate';
      }
      value = value.sort(
        (a, b) =>
          a[sortBy] !== b[sortBy] ? (a[sortBy] > b[sortBy] ? 1 : -1) : 0
      );
      if (!ascending) {
        value = value.reverse();
      }
      return value;
    } else {
      return [];
    }
  }
}
