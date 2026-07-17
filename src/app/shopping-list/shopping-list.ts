import { Component, inject } from '@angular/core';

import { ShoppingEdit } from './shopping-edit/shopping-edit';
import { Ingredient } from '../shared/ingredient';

import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  imports: [ShoppingEdit],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList {
  shoppingListService = inject(ShoppingListService);
  ingredients = this.shoppingListService.ingredients;

  onAddIngredient(ingredient: Ingredient) {
    this.shoppingListService.addIngredient(ingredient);
  }

  onEditItem(index : number) {
    this.shoppingListService.startedEditing.set(index);
  }
}
