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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QualiexploreModule } from './qualiexplore/qualiexplore.module';
import { AuthComponent } from './qualiexplore/auth/auth.component';


const routes: Routes = [
  {
    path: '', redirectTo: '/qualiexplore/auth', pathMatch: 'full'
  },
  {
    path: '', redirectTo: '/qualiexplore/filters', pathMatch: 'full'
  },
  {
    path: 'qualiexplore',
    loadChildren: () => import('./qualiexplore/qualiexplore.module').then(m => m.QualiexploreModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
