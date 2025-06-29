import { Component } from '@angular/core';
import { UserRegister } from "../user-register/user-register";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardWidget } from "../dashboard-widget/dashboard-widget";


@Component({
  selector: 'app-dashboard',
  imports: [RouterLinkActive, RouterLink, DashboardWidget],
  templateUrl: './dashboard.html'
})
export class Dashboard {

}
