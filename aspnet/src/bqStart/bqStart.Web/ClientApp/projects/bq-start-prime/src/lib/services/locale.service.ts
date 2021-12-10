import { HttpClient } from '@angular/common/http';
import { LOCALE_ID, Provider } from '@angular/core';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, map, Observable, of, throwError, timeout } from 'rxjs';
import moment from 'moment';
import defaultTranslations from './../assets/i18n/bq-start.en-US.json';
import { InternalLogService, LogService } from './log/log.service';
import { merge, cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class LocaleService implements TranslateLoader {
  private initialized = false;

  get currentLocale(): string {
    return this.translate.currentLang;
  }

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    @Optional()
    @SkipSelf()
    otherInstance: LocaleService,
  ) {
    if (otherInstance) throw 'LocaleService should have only one instance.';
  }


  getTranslation(lang: string): Observable<any> {
    const $coreTranslation = this.getCoreTranslations(lang);

    const url = `./assets/i18n/${lang}.json`;
    const $translation = this.http.get(url).pipe(
      timeout(2000),
      catchError((error,x) => {
        InternalLogService.logger().error(`Failed to get translations from ${url}`);
        return throwError(() => new Error(`Failed to get translations from ${url}`));
      })
    );

    return forkJoin([$coreTranslation, $translation]).pipe(
    map((responses) => responses.reduce((a, b) => ({...a, ...b}), {})));
  }

  getCoreTranslations(lang: string): Observable<any>{
    const url = `./assets/i18n/bq-start.${lang}.json`;
    return this.http.get(url).pipe(
      timeout(2000),
      catchError((error,x) => {
        InternalLogService.logger().error(`Failed to get translations from ${url}. Using built-in translations for bqAdmin.`);
        return of(defaultTranslations);
      }),
      map((value:any) => {
        const mergedObject = merge(cloneDeep(defaultTranslations), value);
        return mergedObject;
      })
    );
  }

  initLocale(localeId: string, defaultLocaleId = localeId) {
    if (this.initialized) return;

    this.setDefaultLocale(defaultLocaleId);
    this.setLocale(localeId);
    this.initialized = true;
  }

  setDefaultLocale(localeId: string) {
    this.translate.setDefaultLang(localeId);
    moment.locale(localeId);
  }

  setLocale(localeId: string) {
    this.translate.use(localeId);
    moment.locale(localeId);
    InternalLogService.logger().info(`setting locale to ${localeId}`);
  }

}



export class LocaleId extends String {
  constructor(private localeService: LocaleService) {
    super();
  }

  toString(): string {
    return this.localeService.currentLocale;
  }

  valueOf(): string {
    return this.toString();
  }
}

export const LocaleProvider: Provider = {
  provide: LOCALE_ID,
  useClass: LocaleId,
  deps: [LocaleService],
};
