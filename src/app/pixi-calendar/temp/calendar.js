import * as PIXI from 'pixi.js'

let reservations = [];
let rooms = [];
let types = [];

let today = new Date();
let mouseOnDate;
let mouseOnRoom;
let screenWidth     = 0;
let screenHeight    = 0;

PIXI.settings.RESOLUTION =  2;

let app;
let gridContainer;
let newRect ;
let dayBarContainer ;
let roomsBarContainer;

let monthBarTexture;

let calendarEvent = {
  mouseOver: false,
  click: false,
  reservationId: null,
  counter: 0,
  mouse: { x:0, y:0 },

  get c() {
    return this.counter;
  },

  set c(val) {
    this.counter = val;
    this.clistener(this);
  },

  clistener: function () {},
  registerListener: function ( extListenerFunc ) {
    this.clistener = extListenerFunc;
  }

}

// DEAFULT VALUES
let dpv         = 34;
let squareSize  = Math.ceil(screenWidth/dpv);
let paneWidth   = dpv*squareSize;
let nRooms      = 1;

let posY        = squareSize;
let posX        = 0;

let pane        = 1;
let daysBack    = 0;

let padding     = 5;
let dragging    = false;
let mouseX;
let mouseY;
let startAt;

let squareAColumnTexture, squareBColumnTexture;

export function updateReservations(res) {
  renderGrid();
}

export function init(params) {
    reservations    = params.reservations;
    rooms           = params.rooms;
    types           = params.types;
    dpv             = params.dpv;
    padding         = params.padding;
    screenWidth     = params.screenWidth;
    screenHeight    = params.screenHeight;

    today           = params.today
    mouseOnDate     = params.today


    nRooms      = rooms.length;
    squareSize  = Math.ceil(screenWidth/dpv);
    posX        = 0;
    posY        = squareSize;
    paneWidth   = dpv*squareSize;
    pane        = 1;
    daysBack    = 0;

    app = new PIXI.Application({
      width: screenWidth,
      height: screenHeight,
      antialias: true,
      backgroundColor: 0xAABBCC,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });
    // document.getElementById(params.elemId).appendChild(app.view);

    gridContainer = new PIXI.Container();
    app.stage.addChild(gridContainer);
    gridContainer.interactive = true;
    gridContainer.sortableChildren = true;
    gridContainer.on('pointerdown', onDragGridStart)
    .on('pointerup', onDragGridEnd)
    .on('pointerupoutside', onDragGridEnd)
    .on('pointermove', onDragGridMove);

    newRect = new PIXI.Graphics();
    newRect.zIndex = 100;
    gridContainer.addChild(newRect);

    dayBarContainer = new PIXI.Container();
    app.stage.addChild(dayBarContainer);
    dayBarContainer.zIndex = 50;
    dayBarContainer.sortableChildren = true;

    roomsBarContainer = new PIXI.Container();
    app.stage.addChild(roomsBarContainer);
    roomsBarContainer.zIndex = 10;
    roomsBarContainer.sortableChildren = true;

    monthBarTexture = genMonthBar();

    [squareAColumnTexture, squareBColumnTexture] = genSquareColumnTexture();

    calculateRoomPositions();
    renderGrid();
    renderRoomsBar();
    renderDayBar();
    moveGrid();

    scrolling();

    return [app.view, calendarEvent];
}


function calculatePane() {
    let x = Math.ceil((0 - posX)/paneWidth);
    if (x == -0) {
        x = Math.abs(x);
    };
    return x;
}

function calculateRoomPositions() {
    for (let i = 0; i < reservations.length; i++) {
        // console.log( rooms.findIndex((x) => (x.id == reservations[i].roomId)) );
        reservations[i].room = rooms.findIndex((x) => (x.id == reservations[i].roomId))
    }
}

function moveGrid() {
    gridContainer.x = posX;
    gridContainer.y = posY;
    dayBarContainer.x = posX;
    roomsBarContainer.y = posY - 1;
    if (calculatePane() != pane) {
        pane = calculatePane();
        renderGrid();
        renderDayBar();
    } else {
        pane = calculatePane();
    }
}

export function renderGrid() {
    // gridContainer.cacheAsBitmap = false;
    gridContainer.removeChildren();
    gridContainer.addChild(newRect);
    updateSquareSize();
    paneWidth = dpv*squareSize;
    startAt = pane*paneWidth;

    daysBack = (pane - 1)*dpv;
    // console.log(daysBack)
    let firstOfMonth = new Date(today.getTime())
    firstOfMonth.setDate(1)
    // console.log(firstOfMonth)

    let wholeGrid = new PIXI.Container();
    for (let i = 0; i < 2*dpv; i++) {
        let sq = new PIXI.Sprite(squareAColumnTexture);
        // let d = i%7;

        let d = ((i + daysBack + firstOfMonth.getDay())%7 + 7)%7;
        if (d == 6 || d == 0) {
            sq = new PIXI.Sprite(squareBColumnTexture);
        }
        sq.x = i * squareSize;
        wholeGrid.addChild(sq);
    }
    let wholeGridTexture = app.renderer.generateTexture(wholeGrid);

    let wholeGridSprite = new PIXI.Sprite(wholeGridTexture);

    gridContainer.addChild(wholeGridSprite);

    wholeGridSprite.x = startAt - paneWidth;

    // gridContainer.cacheAsBitmap = true;



    renderReservations();
}

function renderReservations() {
    function daysBetweenMonths(x, y) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.floor((( x - y ) / oneDay));
    }

    let atMonth = new Date(today.getTime());
    atMonth.setDate(0)

    // let resTable = []

    for (const reservation of reservations) {
        const resCont = new PIXI.Container();
        gridContainer.addChild(resCont);
        resCont.id = reservation.id;
        resCont.room = reservation.room;
        resCont.reservation = reservation;
        resCont.color = reservation.color;

        let toLimit = Math.min(...(reservations
            .filter(x => x.room == reservation.room)
            .map(x => x.from.getTime())
            .filter(x => x >= reservation.to.getTime())));

        if ( isFinite(toLimit)) {
            toLimit = new Date(toLimit)
        } else {
            toLimit = null;
        }
        resCont.toLimit = toLimit;
        let fromLimit = Math.max(...(reservations
            .filter(x => x.room == reservation.room)
            .map(x => x.to.getTime())
            .filter(x => x <= reservation.from.getTime())));

        if (isFinite(fromLimit)) {
            fromLimit = new Date( fromLimit   );
        } else {
            fromLimit = null;
        }
        resCont.fromLimit = fromLimit;

        let diffDays    = daysBetweenMonths(reservation["from"], atMonth );
        let length      = daysBetweenMonths(reservation["to"], reservation["from"]);
        resCont.rectLen = (length * squareSize) - squareSize;
        resCont.x       = (diffDays*squareSize) + squareSize;

        const rect = new PIXI.Graphics();
        rect.beginFill(reservation["color"]);
        rect.drawRect(0,padding,(length * squareSize) - squareSize,squareSize - padding * 2);
        rect.x = squareSize  - squareSize;
        rect.y += squareSize*reservation["room"];
        rect.interactive = true;
        rect.buttonMode = true;
        resCont.addChild(rect);

        const beginCirc = new PIXI.Graphics();
        beginCirc.beginFill(reservation["color"]);
        beginCirc.drawCircle(0,squareSize/2, squareSize/2 - padding);
        beginCirc.x = squareSize  - squareSize;
        beginCirc.y += squareSize*reservation["room"];
        resCont.addChild(beginCirc);
        beginCirc.interactive = true;
        beginCirc.buttonMode = true;

        const endCirc = new PIXI.Graphics();
        endCirc.beginFill(reservation["color"]);
        endCirc.drawCircle(0,squareSize/2, squareSize/2 - padding);
        endCirc.x = (length * squareSize)  - squareSize;
        endCirc.y += squareSize*reservation["room"]
        resCont.addChild(endCirc);
        endCirc.interactive = true;
        endCirc.buttonMode = true;

        resCont.interactive = true;
        resCont.on('click', mouseOverRect);

        if (length == 1) {
            endCirc
            .on('pointerdown', onDragRectStart)
            .on('pointerup', onDragRectEnd)
            .on('pointerupoutside', onDragRectEnd)
            .on('pointermove', onDragRectMove);
        }
        else {
            rect
            .on('pointerdown', onDragRectStart)
            .on('pointerup', onDragRectEnd)
            .on('pointerupoutside', onDragRectEnd)
            .on('pointermove', onDragRectMove)

            beginCirc
            .on('pointerdown', onDragLeftStart)
            .on('pointerup', onDragLeftEnd)
            .on('pointerupoutside', onDragLeftEnd)
            .on('pointermove', onDragLeftMove);

            endCirc
            .on('pointerdown', onDragRightStart)
            .on('pointerup', onDragRightEnd)
            .on('pointerupoutside', onDragRightEnd)
            .on('pointermove', onDragRightMove);
        }
        // resTable.push(resCont)

    }
    // return resTable;
}

function mouseOverRect(event) {
    console.log("kliknięte", event);
    console.info('mouse width', app.renderer.plugins.interaction.mouse.global);
    console.info('klikniete this', this);
    calendarEvent.mouse = app.renderer.plugins.interaction.mouse.global;
    calendarEvent.click = true;
    calendarEvent.reservationId = this.id;
    calendarEvent.c++;
}




// CREATE RESERVATION
function onDragGridStart(event) {
    updateMouseOnDate()

    // console.log(mouseOnRoom)

    let toLimit = Math.min(...(reservations
        .filter(x => x.room == mouseOnRoom - 1)
        .filter(x => x.from.getTime() >= mouseOnDate.getTime()))
        .map(x => x.from.getTime())
        );

    if ( isFinite(toLimit)) {
        toLimit = new Date(toLimit)
    } else {
        toLimit = null;
    }
    this.toLimit = toLimit;

    let fromLimit = (reservations
        .filter(x => x.room == mouseOnRoom - 1)
        .filter(x => x.from.getTime() <= mouseOnDate.getTime())
        .sort((a,b) => b.from.getTime() - a.from.getTime()));

    if (    fromLimit.length == 0 ||    (fromLimit.length > 0 && fromLimit[0].to.getTime() <= mouseOnDate.getTime())) {
        // console.log("yes")
        // console.log('toLimit', this.toLimit)
        if (dragging == false && mouseOnRoom > 0) {
            this.dragging = true;
        }
    }



    if (this.dragging == true) {
        this.data = event.data;
        const newPosition = this.data.getLocalPosition(this.parent);
        // console.log("pos", newPosition)

        // console.log("Starting dragging");
        this.room = mouseOnRoom
        this.startAt = mouseOnDate
        let x = newPosition.x - gridContainer.x - ((newPosition.x - gridContainer.x)%squareSize + squareSize)%squareSize + squareSize;
        this.rectX = x;
        this.rectY = squareSize*(this.room - 1);

        const beginCirc = new PIXI.Graphics();
        beginCirc.beginFill(0xd12a0d);
        beginCirc.drawCircle(0,squareSize/2, squareSize/2 - padding);
        // console.log(-(newPosition.x)%squareSize - (gridContainer.x)%squareSize)
        // console.log(    (newPosition.x - gridContainer.x)%squareSize    )
        beginCirc.x = x ;
        beginCirc.y += squareSize*(this.room - 1);
        this.addChild(beginCirc);
        beginCirc.interactive = true;
        beginCirc.buttonMode = true;

        // newEndCirc.clear();
        const newEndCirc = new PIXI.Graphics();
        newEndCirc.beginFill(0xd12a0d);
        newEndCirc.drawCircle(0 , squareSize/2, squareSize/2 - padding);
        newEndCirc.x = x;
        newEndCirc.y =+ squareSize*(this.room - 1);
        this.addChild(newEndCirc)
        this.newEndCirc = newEndCirc;

        this.from = mouseOnDate;

        // newRect.clear()
        // newRect.beginFill(0x2dc46a);
        // newRect.drawRect(x,padding + (squareSize*(mouseOnRoom-1)),5 * squareSize,squareSize - padding * 2);

        // console.log(newRect)
        // console.log(gridContainer)
        // this.rect.x = newPosition.x - gridContainer.x - ((newPosition.x - gridContainer.x)%squareSize + squareSize)%squareSize + squareSize;
        // this.rect.y += squareSize*mouseOnRoom;

    }

}

function onDragGridMove(event) {
    updateMouseOnDate()
    if (this.dragging == true) {
        if ( !this.toLimit || mouseOnDate.getTime() < this.toLimit.getTime() ) {

            if (mouseOnDate.getTime() > this.from.getTime()) {

                this.data = event.data;
                const newPosition = this.data.getLocalPosition(this.parent);

                let x = newPosition.x - gridContainer.x //- ((newPosition.x - gridContainer.x)%squareSize + squareSize)%squareSize + squareSize;

                newRect.clear()
                newRect.beginFill(0xd12a0d);
                newRect.drawRect(this.rectX,this.rectY + padding,x - this.rectX,squareSize - padding * 2);

                this.newEndCirc.x = x;
            }

        }
    }
}

function onDragGridEnd() {
    if(this.dragging) {

        updateMouseOnDate()
        let end = mouseOnDate;
        let start = this.startAt;

        if (this.toLimit && end.getTime() > this.toLimit.getTime()) {
            end = this.toLimit;
        }
        if (end.getTime() <= start.getTime()) {
            end = new Date(start.getTime() + 1000*60*60*24)
            console.log(start)
        }

        if(this.dragging) {
            reservations.push({from: start,
                to: end,
                room: this.room - 1,
                id: 100 + Math.floor(Math.random() * Math.floor(100)),
                roomId: rooms[mouseOnRoom - 1].id,
                color: 0xd12a0d
            })
        }
        this.dragging = false
        newRect.clear()
        renderGrid()


    }
}




// DRAG RECT
function onDragRectStart(event) {
    updateMouseOnDate()
    this.changeToRoom = mouseOnRoom -  1;
    this.data = event.data;
    this.dragging = true;
    dragging = true;
}

function onDragRectMove(event) {
    updateMouseOnDate();
    if (this.dragging) {
        let obstacles = reservations
        .filter((x) => (x.room == mouseOnRoom - 1))
        .filter((x) => x.from.getTime() < this.parent.reservation.to.getTime())
        .filter((x) => x.to.getTime() > this.parent.reservation.from.getTime());
        if ((obstacles.length == 0 && 0 < mouseOnRoom && mouseOnRoom - 1< rooms.length) || mouseOnRoom - 1 == this.parent.room) {
            this.changeToRoom = mouseOnRoom -  1;
            this.parent.y = (mouseOnRoom - this.parent.room - 1) * squareSize;
        }
    }
}

function onDragRectEnd() {
    if (this.dragging) {
        this.parent.reservation.roomId = rooms[this.changeToRoom].id
        calculateRoomPositions()
        this.dragging = false;
        dragging = false;
        renderGrid()
    }
}




// DRAG LEFT
function onDragLeftStart(event) {
    this.data = event.data;
    this.dragging = true;
}

function onDragLeftMove() {
    updateMouseOnDate()
    if (this.dragging && ( !this.parent.fromLimit  || this.parent.fromLimit.getTime() < mouseOnDate.getTime()  ) ) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x
        const rect = this.parent.children[0];
        rect.clear();
        rect.beginFill(this.parent.color);
        rect.drawRect(newPosition.x, padding, this.parent.rectLen - newPosition.x , squareSize - padding * 2);
    }
}

function onDragLeftEnd() {
    if (this.dragging) {
        updateMouseOnDate()

        if ( !this.parent.fromLimit || mouseOnDate.getTime()   >=    this.parent.fromLimit.getTime()) {
            reservations.filter( x => x.id == this.parent.id)[0].from = mouseOnDate;
        } else {
            reservations.filter( x => x.id == this.parent.id)[0].from = this.parent.fromLimit;
        }

        if ((reservations.filter( x => x.id == this.parent.id)[0].to.getTime()) < (reservations.filter( x => x.id == this.parent.id)[0].from.getTime()) ) {
            [reservations.filter( x => x.id == this.parent.id)[0].to, reservations.filter( x => x.id == this.parent.id)[0].from] = [reservations.filter( x => x.id == this.parent.id)[0].from, reservations.filter( x => x.id == this.parent.id)[0].to ];
            // reservations.filter( x => x.id == this.parent.id)[0].from = new Date(reservations.filter( x => x.id == this.parent.id)[0].from.getTime() - 1000*60*60*24)
        }

        if (mouseOnDate.getTime() == (reservations.filter( x => x.id == this.parent.id)[0].to.getTime())) {
            // console.log("yesyesyes")
            reservations.filter( x => x.id == this.parent.id)[0].from = new Date(reservations.filter( x => x.id == this.parent.id)[0].from.getTime() - 1000*60*60*24)
        }

        renderGrid()

    }
    this.dragging = false;
    this.data = null;
}




// DRAG RIGHT
function onDragRightStart(event) {
    this.data = event.data;
    this.dragging = true;
    dragging = true;
}

function onDragRightMove() {
    updateMouseOnDate()
    if (this.dragging) {
        if ( !this.parent.toLimit || mouseOnDate.getTime() < this.parent.toLimit.getTime() ) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            const rect = this.parent.children[0];
            rect.clear();
            rect.beginFill(this.parent.color);
            rect.drawRect(0,padding,newPosition.x ,squareSize - padding * 2);
        }
    }
}

function onDragRightEnd() {
    if (this.dragging) {
        updateMouseOnDate()

        if ( !this.parent.toLimit || mouseOnDate.getTime()   <=    this.parent.toLimit.getTime()) {
            reservations.filter( x => x.id == this.parent.id)[0].to = mouseOnDate;
        } else {
            reservations.filter( x => x.id == this.parent.id)[0].to = this.parent.toLimit;
        }


        if ((reservations.filter( x => x.id == this.parent.id)[0].to.getTime()) < (reservations.filter( x => x.id == this.parent.id)[0].from.getTime()) ) {
            [reservations.filter( x => x.id == this.parent.id)[0].to, reservations.filter( x => x.id == this.parent.id)[0].from] = [reservations.filter( x => x.id == this.parent.id)[0].from, reservations.filter( x => x.id == this.parent.id)[0].to ];
            // reservations.filter( x => x.id == this.parent.id)[0].to = new Date(reservations.filter( x => x.id == this.parent.id)[0].to.getTime() + 1000*60*60*24)
        }

        // console.log(mouseOnDate.getTime())
        // console.log(reservations.filter( x => x.id == this.parent.id)[0].from.getTime())
        if (mouseOnDate.getTime() == (reservations.filter( x => x.id == this.parent.id)[0].from.getTime())) {
            // console.log("yesyesyes")
            reservations.filter( x => x.id == this.parent.id)[0].to = new Date(reservations.filter( x => x.id == this.parent.id)[0].to.getTime() + 1000*60*60*24)
        }

        renderGrid()
    }
    this.dragging = false;
    this.data = null;
    dragging = false;
}




function updateMouseOnDate() {
    mouseOnRoom = Math.ceil( ( mouseY - posY ) / squareSize );
    mouseOnDate = new Date(today.getTime());
    mouseOnDate.setDate(Math.floor(((-posX + mouseX)/squareSize)) + 1);
    mouseOnDate.setHours(0);
    mouseOnDate.setMinutes(0);
    mouseOnDate.setSeconds(0);
    mouseOnDate.setMilliseconds(0);
}

const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
function daysInMonth(m, y) {
    if (m == 1) {
        return 28 + Number( ((y%4 == 0) && (y%100 != 0)) || (y%400 == 0) ) ;
    } else if (m < 7) {
        return 30 + ((m+1)%2);
    } else {
        return 30 + ((m)%2);
    }
}

const font = 'Arial';
const style = {
    fontFamily : font,
    fontSize: 12,
    fill : 0x000000,
    align : 'center'
}


function renderComponents() {
    monthBarTexture = genMonthBar();
    [squareAColumnTexture, squareBColumnTexture] = genSquareColumnTexture();
}

function genSquareColumnTexture() {

    updateSquareSize();
    paneWidth = dpv*squareSize;
    startAt = pane*paneWidth;

    const squareA = new PIXI.Graphics();
    squareA.beginFill(0xFFFFFF);
    squareA.lineStyle(1, 0x444444);
    squareA.drawRect(0,0,squareSize - 2,squareSize - 2);
    const squareATexture = app.renderer.generateTexture(squareA);

    const squareB = new PIXI.Graphics();
    squareB.beginFill(0xFFFF99);
    squareB.lineStyle(1, 0x444444);
    squareB.drawRect(0,0,squareSize - 2,squareSize - 2);
    const squareBTexture = app.renderer.generateTexture(squareB);

    const squareAColumn = new PIXI.Container();
    const squareBColumn = new PIXI.Container();
    for (let j = 0; j < nRooms; j++) {
        let squareASprite = new PIXI.Sprite(squareATexture);
        squareASprite.y = j * squareSize;
        squareAColumn.addChild(squareASprite);

        let squareBSprite = new PIXI.Sprite(squareBTexture);
        squareBSprite.y = j * squareSize;
        squareBColumn.addChild(squareBSprite);
    }
    const squareAColumnTexture = app.renderer.generateTexture(squareAColumn);
    const squareBColumnTexture = app.renderer.generateTexture(squareBColumn);
    return [squareAColumnTexture, squareBColumnTexture];
}

function updateSquareSize() {
    squareSize = Math.ceil(screenWidth/dpv);
}

function genMonthBar() {
    const h = 20;
    const lw = 1;
    updateSquareSize();
    // let dim = daysInMonth(m, y);
    let monthBar = new PIXI.Container();
    const nameBar = new PIXI.Graphics();
    nameBar.beginFill(0xFFFFFF);
    nameBar.lineStyle(lw, 0x444444);
    nameBar.drawRect(0,Math.floor(lw/2),32 * squareSize,h);
    monthBar.addChild(nameBar);

    for (let i = 0; i < 31; i++) {
        const day = new PIXI.Graphics();
        day.beginFill(0xFFFFFF);
        day.lineStyle(lw, 0x444444);
        day.drawRect(i*squareSize,0,squareSize,h);
        day.x = 0;
        day.y = h;
        monthBar.addChild(day)
        let text = new PIXI.Text(i+1,style);
        text.resolution = 2;
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        text.x = (i + 0.5 )* squareSize;
        text.y = h + 0.5*h;
        monthBar.addChild(text);
    }
    return app.renderer.generateTexture(monthBar);
}

function renderDayBar() {
    // console.log("\n","PANE", pane)
    dayBarContainer.removeChildren();
    daysBack = (pane - 1)*dpv;
    // console.log(daysBack, "days back")
    let atMonth = new Date(today.getTime());
    let atDay = 0;
    if (pane < 0) {
        while (atDay > daysBack) {
            atMonth.setMonth(atMonth.getMonth() - 1 );
            atDay -= daysInMonth(atMonth.getMonth(), atMonth.getFullYear());
        }
    } else {
        atMonth.setMonth(atMonth.getMonth() - 1 );
        while (atDay < daysBack) {
            atMonth.setMonth(atMonth.getMonth() + 1 );
            atDay += daysInMonth(atMonth.getMonth(), atMonth.getFullYear());
        }
        atDay -= daysInMonth(atMonth.getMonth(), atMonth.getFullYear());
        atMonth.setMonth(atMonth.getMonth() - 1 );
        atDay -= daysInMonth(atMonth.getMonth(), atMonth.getFullYear());
    }

    let daysToRender = atDay + 4*dpv;
    // const mt = genMonthBar();

    while (atDay < daysToRender) {
        let monthBarSprite = new PIXI.Sprite(monthBarTexture);
        // let monthBarSprite = genMonthBar(0,0);
        monthBarSprite.x = atDay * squareSize - 1;
        monthBarSprite.zIndex = 600;
        // console.log("n", atDay);
        // console.log(monthNames[atMonth.getMonth()], daysInMonth(atMonth.getMonth(), atMonth.getFullYear()));
        atDay += daysInMonth(atMonth.getMonth(), atMonth.getFullYear());
        atMonth.setMonth(atMonth.getMonth() + 1 );

        const nameText = new PIXI.Text(monthNames[atMonth.getMonth()] + " " + atMonth.getFullYear(),style);
        // nameText.resolution = 2;
        nameText.anchor.y = 0.5;
        nameText.y = 20/2;
        nameText.x = squareSize/2 + (atDay*squareSize);
        nameText.zIndex = 700;
        dayBarContainer.addChild(monthBarSprite);
        dayBarContainer.addChild(nameText);

    }
}

function renderRoomsBar() {
    const style2 = {
    fontFamily : 'Arial',
    fontSize: 14,
    fill : 0x000000,
    align : 'left'
    }
    roomsBarContainer.removeChildren();

    const rc = new PIXI.Container();
    // rc.y -= 1;
    rc.sortableChildren = true;

    const lw = 1;
    const nameBar = new PIXI.Graphics();
    nameBar.beginFill(0xFFFFFF);
    nameBar.lineStyle(lw, 0x444444);
    nameBar.drawRect(0, 0, 2 * squareSize,squareSize);
    let nameBarTexture = app.renderer.generateTexture(nameBar);

    for (let i = 0; i < rooms.length; i++) {
        // console.log("dhlfjslkd")
        const nameBarSprite = new PIXI.Sprite( nameBarTexture );
        rc.addChild(nameBarSprite);
        nameBarSprite.y = i*squareSize
        nameBarSprite.zIndex = 600;

        const nameText = new PIXI.Text( rooms[i]["name"] ,style2);
        nameText.anchor.y = 0.5;
        nameText.x = Math.floor( squareSize/3 )
        nameText.y = Math.floor( i*squareSize + squareSize/2 )
        nameText.zIndex = 700;
        rc.addChild(nameText)
    }
    const roomBarTexture = app.renderer.generateTexture(rc);
    const roomBarSprite = new PIXI.Sprite(roomBarTexture);

    roomsBarContainer.addChild(roomBarSprite)
}

// calculateRoomPositions();

// renderGrid();
// renderRoomsBar();
// renderDayBar();
// moveGrid();



// document.getElementById("reverseRooms").addEventListener("click", () => {
//     rooms.reverse()
//     // console.table(rooms)
//     calculateRoomPositions()
//     renderGrid()
//     renderRoomsBar()
//     // renderReservations()
// })

// const inputDpv = document.getElementById("dpv");
// inputDpv.addEventListener("input", updateDpv);
function updateDpv(e) {
    // let val = inputDpv.value;
    let val = 40;
    if (!isNaN(val) && val > 0){
        dpv = val;
        // dpv += 1;
    }
    renderComponents();
    renderGrid();
    renderRoomsBar();
    renderDayBar();
}


// SCROLLING

function scrolling() {
    var horizontalVelocity = 0;
    var verticalVelocity = 0;
    const scrollMargin = screenWidth/5;
    const left = scrollMargin;
    const right = screenWidth - scrollMargin;

    app.ticker.add((delta) => {

        mouseX = app.renderer.plugins.interaction.mouse.global.x;
        mouseY = app.renderer.plugins.interaction.mouse.global.y;

        if (mouseX > 0 && mouseY > 0 && mouseX < screenWidth && mouseY < screenHeight) {

            if (mouseX > right) {
                horizontalVelocity = 5;
            } else if (mouseX < left) {
                horizontalVelocity = -5;
            } else {
                horizontalVelocity = 0;
            }
            if  (mouseY > screenHeight - 100) {
                verticalVelocity = 5;
            } else if (mouseY < 100) {
                verticalVelocity = -5;
            } else {
                verticalVelocity = 0;
            }

        } else {
            verticalVelocity = 0;
            horizontalVelocity = 0;
        }

        posX -= horizontalVelocity;
        posY -= verticalVelocity;
        moveGrid();

    });
}

