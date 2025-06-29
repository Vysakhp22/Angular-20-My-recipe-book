import { Component } from '@angular/core';
import { UserRegister } from "../user-register/user-register";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashbroardWidget } from "../dashbroard-widget/dashbroard-widget";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLinkActive, RouterLink, DashbroardWidget],
  templateUrl: './dashboard.html'
})
export class Dashboard {

}
