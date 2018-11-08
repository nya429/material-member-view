import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'materail-app';

  mode = 'side';
  xsQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  ngOnInit() {
  }

  constructor(changeDetectorRef: ChangeDetectorRef,
     media: MediaMatcher) {
    this.xsQuery = media.matchMedia('(max-width: 1280px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.xsQuery.addListener(this._mobileQueryListener);
  }
}
