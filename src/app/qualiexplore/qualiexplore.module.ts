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


import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { FiltersComponent } from './filters/filters.component';
import { FactorsComponent } from './factors/factors.component';
import { QualiexploreRoutingModule } from './qualiexplore-routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './auth/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgxTreeDndModule } from 'ngx-tree-dnd';
import { EditTreeComponent } from './edit-tree/edit-tree.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit,faMinus,faPlus,faTimes } from '@fortawesome/free-solid-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

@NgModule({

  declarations: [FiltersComponent, FactorsComponent, PageNotFoundComponent, EditTreeComponent, AuthComponent, HeaderComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    QualiexploreRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTreeDndModule,
    TreeviewModule.forRoot(),
    NgbModule, 
    FontAwesomeModule
  ],
  providers: [AuthService]
})
export class QualiexploreModule {
   constructor(){
      library.add(faEdit, faMinus, faPlus, faTimes, fas, far);
   }
 }
