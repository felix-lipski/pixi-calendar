import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PixiTestComponent } from './pixi-test/pixi-test.component';
import { PixiCalendarComponent } from './pixi-calendar/pixi-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    PixiTestComponent,
    PixiCalendarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
