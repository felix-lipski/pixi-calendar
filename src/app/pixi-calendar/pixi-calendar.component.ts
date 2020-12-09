import { Component, OnInit , ElementRef} from '@angular/core';
import { interval } from 'rxjs';
import { init } from './calendar.js'

@Component({
  selector: 'app-pixi-calendar',
  templateUrl: './pixi-calendar.component.html',
  styles: []
})
export class PixiCalendarComponent implements OnInit {

  public calendarTooltipStyle = '';
  public calendarTooltipText = '';

  private reservations = [
    {from: new Date(2020, 11, 11), to: new Date(2020, 11, 17), room: 0, id: 64, roomId:  1, color: 0x3C87C4},
    {from: new Date(2020, 11, 20), to: new Date(2020, 11, 25), room: 0, id: 43, roomId:  6, color: 0x31A24C},
    {from: new Date(2020, 11, 27), to: new Date(2020, 11, 30), room: 0, id: 65, roomId: 13, color: 0x3C87C4},
    {from: new Date(2020, 11, 26), to: new Date(2020, 11, 31), room: 0, id:  3, roomId: 11, color: 0xE5CA00},
    {from: new Date(2020, 11, 5 ), to: new Date(2020, 11, 9 ), room: 0, id: 62, roomId: 13, color: 0x31A24C},
    {from: new Date(2020, 11, 30), to: new Date(2021,  0, 4 ), room: 0, id: 88, roomId: 16, color: 0xd12a0d}
  ];

  private rooms = [
      {id:  3, name: "Bryza"      , typeId: 20},
      {id:  1, name: "Kasia"      , typeId: 20},
      {id:  6, name: "Horyzont"   , typeId: 20},
      {id: 11, name: "Tomek"      , typeId: 21},
      {id: 12, name: "03-2"       , typeId: 10},
      {id: 13, name: "43e"        , typeId: 10},
      {id: 16, name: "07"         , typeId: 10},
      {id: 17, name: "08"         , typeId: 10},
      {id: 23, name: "09"         , typeId: 11},
      {id: 26, name: "10"         , typeId: 11},
      {id: 27, name: "11"         , typeId: 22},
      {id: 28, name: "fa"         , typeId: 22},

      {id: 103, name: "Bryza"      , typeId: 20},
      {id: 101, name: "Kasia"      , typeId: 20},
      {id: 106, name: "Horyzont"   , typeId: 20},
      {id: 111, name: "Tomek"      , typeId: 21},
      {id: 112, name: "03-2"       , typeId: 10},
      {id: 113, name: "43e"        , typeId: 10},
      {id: 116, name: "07"         , typeId: 10},
      {id: 117, name: "08"         , typeId: 10},
      {id: 123, name: "09"         , typeId: 11},
      {id: 126, name: "10"         , typeId: 11},
      {id: 127, name: "11"         , typeId: 22},
      {id: 128, name: "fa"         , typeId: 22},

      {id: 203, name: "Bryza"      , typeId: 20},
      {id: 201, name: "Kasia"      , typeId: 20},
      {id: 206, name: "Horyzont"   , typeId: 20},
      {id: 211, name: "Tomek"      , typeId: 21},
      {id: 212, name: "03-2"       , typeId: 10},
      {id: 213, name: "43e"        , typeId: 10},
      {id: 216, name: "07"         , typeId: 10},
      {id: 217, name: "08"         , typeId: 10},
      {id: 223, name: "09"         , typeId: 11},
      {id: 226, name: "10"         , typeId: 11},
      {id: 227, name: "11"         , typeId: 22},
      {id: 228, name: "fa"         , typeId: 22}
      
  ];

  private types = [
      {name: "Jednoosobowy",                  typeId: 10},
      {name: "Jednoosobowy - Łazienka",       typeId: 11},
      {name: "Dwuosobowy",                    typeId: 20},
      {name: "Dwuosobowy - Łazienka",         typeId: 21},
      {name: "Dwuosobowy - Łazianka, Taras",  typeId: 22},
  ];

  private params = {
      reservations    : this.reservations,
      rooms           : this.rooms,
      types           : this.types,
      dpv             : 36,
      padding         : 5,
      screenWidth     : 500,
      screenHeight    : 500,


      today           : new Date(),

      elemId: "calendar"
  }

  constructor(private pixiContainer: ElementRef) { 
  }
  
  ngOnInit(): void {
    this.params.screenWidth = window.innerWidth;
    this.params.screenHeight = window.innerHeight;
    const view = init(this.params)
    this.pixiContainer.nativeElement.appendChild(view[0]);
  
    // const clock = interval(1000);
    // clock.subscribe(() => console.log(view[1].resId));
  
    view[1].registerClickListener( (val) => {
      console.info('mouseOver', val, );
      const txt = this.reservations.filter( x => x.id === val.reservationId)[0].from.toDateString();
      console.info('txt', txt, val.reservationId);
      this.calendarTooltipText = txt;
      this.calendarTooltipStyle = 'display:block; left: ' + Math.round(view[1].mouse.x);
      this.calendarTooltipStyle += 'px; ' + 'top: ' + Math.round(view[1].mouse.y) + 'px;';
    } );

    view[1].registerMouseOverListener( (val) => {
      console.info('click', val, );
      const txt = this.reservations.filter( x => x.id === val.reservationId)[0].from.toDateString();
      console.info('txt', txt, val.reservationId);
      this.calendarTooltipText = txt;
      this.calendarTooltipStyle = 'display:block; left: ' + Math.round(view[1].mouse.x);
      this.calendarTooltipStyle += 'px; ' + 'top: ' + Math.round(view[1].mouse.y) + 'px;';
    } );
    view[1].registerMouseOutListener( (val) => {
      console.info('mouseOut', val, );
      const txt = this.reservations.filter( x => x.id === val.reservationId)[0].from.toDateString();
      console.info('txt', txt, val.reservationId);
      this.calendarTooltipText = txt;
      this.calendarTooltipStyle = 'display:block; left: ' + Math.round(view[1].mouse.x);
      this.calendarTooltipStyle += 'px; ' + 'top: ' + Math.round(view[1].mouse.y) + 'px;';
    } );
    view[1].registerCreateReservationListener( (val) => {
      console.info('Create Reservation', val, );
      const txt = this.reservations.filter( x => x.id === val.reservationId)[0].from.toDateString();
      console.info('txt', txt, val.reservationId);
      this.calendarTooltipText = txt;
      this.calendarTooltipStyle = 'display:block; left: ' + Math.round(view[1].mouse.x);
      this.calendarTooltipStyle += 'px; ' + 'top: ' + Math.round(view[1].mouse.y) + 'px;';
    } );
  }

}
