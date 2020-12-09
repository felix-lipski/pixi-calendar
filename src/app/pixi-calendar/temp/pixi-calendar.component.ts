import { Component, OnInit , ElementRef} from '@angular/core';
import { init, renderGrid, updateReservations } from './calendar.js'

@Component({
  selector: 'app-pixi-calendar',
  templateUrl: './pixi-calendar.component.html',
  styleUrls: [ './pixi-calendar.component.scss' ]
})
export class PixiCalendarComponent implements OnInit {

  public calendarTooltipStyle = '';
  public calendarTooltipText = '';

  private reservations = [
    {from: new Date(2020, 10, 11), to: new Date(2020, 10, 17), room: 0, id: 64, roomId:  1, color: 0x3C87C4},
    {from: new Date(2020, 10, 20), to: new Date(2020, 10, 25), room: 0, id: 43, roomId:  6, color: 0x31A24C},
    {from: new Date(2020, 10, 27), to: new Date(2020, 10, 30), room: 0, id: 65, roomId: 13, color: 0x3C87C4},
    {from: new Date(2020, 10, 26), to: new Date(2020, 10, 31), room: 0, id:  3, roomId: 11, color: 0xE5CA00},
    {from: new Date(2020, 11, 1 ), to: new Date(2020, 11, 3 ), room: 0, id: 62, roomId: 13, color: 0x31A24C},
    {from: new Date(2020, 10, 7 ), to: new Date(2020, 10, 11), room: 0, id: 88, roomId: 16, color: 0xd12a0d}
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
      {id: 28, name: "fa"         , typeId: 22}
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
      dpv             : 40,
      padding         : 5,
      screenWidth     : 500,
      screenHeight    : 500,


      today           : new Date(),

      elemId: 'calendar'
  };

  constructor( private pixiContainer: ElementRef) {



  }

  ngOnInit(): void {

    this.params.screenWidth = window.innerWidth;
    this.params.screenHeight = window.innerHeight;
    this.params.screenHeight = 600;
    console.info('params', this.params);
    const view = init(this.params);
    this.pixiContainer.nativeElement.appendChild(view[0]);

    /*setInterval( ()=> {
      console.info('calevent', view[1]);
    }, 2000);
*/
    view[1].registerListener( (val) => {
      console.info('klikniete 2', val, );
      const txt = this.reservations.filter( x => x.id === val.reservationId)[0].from.toDateString();
      console.info('txt', txt, val.reservationId);
      this.calendarTooltipText = txt;
      this.calendarTooltipStyle = 'display:block; left: ' + Math.round(view[1].mouse.x);
      this.calendarTooltipStyle += 'px; ' + 'top: ' + Math.round(view[1].mouse.y) + 'px;';

    } );


  }

  addreservation():void {

    const newRes =  {from: new Date(2020, 11, 7 ), to: new Date(2020, 11, 11), room: 0, id: 878, roomId: 26, color: 0xd12a0d}
    this.reservations.push(newRes);
    console.info('res 00', this.reservations);
    updateReservations( this.reservations );

  }

}