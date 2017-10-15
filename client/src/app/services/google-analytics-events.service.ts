/// <reference path="../../../node_modules/@types/google.analytics/index.d.ts" />

import { Injectable } from '@angular/core';
@Injectable()
export class GoogleAnalyticsEventsService {

  constructor() { }

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
