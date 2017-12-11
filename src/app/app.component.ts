
import { Component, OnInit } from '@angular/core';


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('expandInAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        }),
        animate('300ms ease-in')
      ]),
    ]),
    trigger('shrinkOutAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'scaleY(1)',
        })
      ),
      transition(':leave', [
        animate('300ms ease-out', style({
          opacity: 0,
          transform: 'scale(0.8)',
        }))
      ])
    ])
  ]
})

export class AppComponent {
  constructor() {}

}

