import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { FormComponent } from "./form/form.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "link/create", component: FormComponent },
  { path: "link/edit/:id", component: FormComponent },
  { path: "", redirectTo: "/link/create", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
