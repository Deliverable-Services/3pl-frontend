import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionLocationListComponent } from './connection-location-list/connection-location-list.component';
import { ConnectionLocationFormComponent } from './connection-location-form/connection-location-form.component';

const routes: Routes = [
  {
    path: "",
    component: ConnectionLocationListComponent,
  },
  {
    path: "add",
    component: ConnectionLocationFormComponent,
  },
  {
    path: "edit/:id",
    component: ConnectionLocationFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectionLocationRoutingModule { }
