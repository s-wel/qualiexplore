/**
 * Copyright 2024
 * University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
 * In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TimeoutService } from './timeout.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'qualiexplore';
  constructor(private router: Router, private timeoutService: TimeoutService) {}

  ngOnInit(): void {
    this.timeoutService.startTimer();
  }

  onUserActivity(): void {
    if (this.router.url !== '/qualiexplore/auth') {
      // console.log("User activity detected, resetting timer.");
      this.timeoutService.resetTimer();
    }
  }
}
