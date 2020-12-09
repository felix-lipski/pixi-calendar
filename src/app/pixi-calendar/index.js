import * as cal from './calendar'

let reservations = [
    {from: new Date(2020, 10, 11), to: new Date(2020, 10, 17), room: 0, id: 64, roomId:  1, color: 0x3C87C4},
    {from: new Date(2020, 10, 20), to: new Date(2020, 10, 25), room: 0, id: 43, roomId:  6, color: 0x31A24C},
    {from: new Date(2020, 10, 27), to: new Date(2020, 10, 30), room: 0, id: 65, roomId: 13, color: 0x3C87C4},
    {from: new Date(2020, 10, 26), to: new Date(2020, 10, 31), room: 0, id:  3, roomId: 11, color: 0xE5CA00},
    {from: new Date(2020, 11, 1 ), to: new Date(2020, 11, 3 ), room: 0, id: 62, roomId: 13, color: 0x31A24C},
    {from: new Date(2020, 10, 7 ), to: new Date(2020, 10, 11), room: 0, id: 88, roomId: 16, color: 0xd12a0d}

];

let rooms = [
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

let types = [
    {name: "Jednoosobowy",                  typeId: 10},
    {name: "Jednoosobowy - Łazienka",       typeId: 11},
    {name: "Dwuosobowy",                    typeId: 20},
    {name: "Dwuosobowy - Łazienka",         typeId: 21},
    {name: "Dwuosobowy - Łazianka, Taras",  typeId: 22},
];

let params = {
    reservations    : reservations,
    rooms           : rooms,
    types           : types,
    dpv             : 36,
    padding         : 5,
    screenWidth     : window.innerWidth,
    screenHeight    : window.innerHeight,


    today           : new Date(),

    elemId: "calendar"
}

window.onload = () => cal.init(params)