/**
 * Copyright 2020
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

import { FiltersComponent } from './filters/filters.component';
import { FactorsComponent } from './factors/factors.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditTreeComponent } from './edit-tree/edit-tree.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    {
        path: 'auth', 
        component: AuthComponent
    },
    {
        path: 'filters',
        component: FiltersComponent
    },
    {
        path: 'factors',
        component: FactorsComponent
    },
    {
        path: 'edit',
        component: EditTreeComponent
    },
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full',
        
    },
    {
        path: '**',
        pathMatch: 'full',
        component: PageNotFoundComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class QualiexploreRoutingModule {}
