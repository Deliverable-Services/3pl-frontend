import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "./@core/services/auth-guard-service.guard";
import { LoginComponent } from "./@shared/components/login/login.component";
import { RegisterComponent } from "./@shared/components/register/register.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "",
    redirectTo: "/product/category",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "pages",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
