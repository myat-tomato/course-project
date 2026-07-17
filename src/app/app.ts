import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'

import { HeaderComponent } from './header/header';
// import { Recipes } from './recipes/recipes';
// import { ShoppingList } from './shopping-list/shopping-list';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('course-project');
}
