import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./components/pages/login/login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'my-recipe-book';
}
