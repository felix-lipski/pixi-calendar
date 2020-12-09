import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var PIXI: any;

@Component({
  selector: 'app-pixi-test',
  templateUrl: './pixi-test.component.html',
  styles: []
})


export class PixiTestComponent implements OnInit {

  // @ViewChild('pixiContainer') pixiContainer; //: ElementRef;

  public pApp: any;

  constructor(pixiContainer: ElementRef) { 
    console.log(window.innerWidth, window.innerHeight);
    console.log(new Date());
    this.pApp = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
    pixiContainer.nativeElement.appendChild(this.pApp.view);

  }
  
  ngOnInit(): void {
    const graphics = new PIXI.Graphics();

    // Rectangle
    graphics.beginFill(0xDE3249);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();
    graphics.interactive = true;
    graphics.buttonMode = true;

    this.pApp.stage.addChild(graphics);
  }

}
