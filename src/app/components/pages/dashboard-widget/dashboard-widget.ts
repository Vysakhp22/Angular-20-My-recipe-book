import { Component } from '@angular/core';
import { Countup } from '@core/directives/countup';
import { DashboardRecentRecipes } from "../dashboard-recent-recipes/dashboard-recent-recipes";

@Component({
  selector: 'app-dashboard-widget',
  imports: [Countup, DashboardRecentRecipes],
  templateUrl: './dashboard-widget.html',
  styles: ``
})
export class DashboardWidget {

}
