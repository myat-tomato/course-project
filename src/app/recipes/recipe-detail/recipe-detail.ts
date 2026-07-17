import { Component, input, inject, computed, signal } from '@angular/core';
import { DropdownDirective } from "../../shared/dropdown.directive";
import { ShoppingListService } from '../../shopping-list/shopping-list.service';
import { RecipeService } from '../recipe.service';

import { Router, RouterLink, TitleStrategy } from "@angular/router";

@Component({
  selector: 'app-recipe-detail',
  imports: [DropdownDirective, RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail {
  name = input.required<string>();

  shoppingListService = inject(ShoppingListService);
  recipeService = inject(RecipeService);
  router = inject(Router);

  recipeList = this.recipeService.recipes;

  recipe = computed(() => this.recipeService.findRecipe(this.name()));
  // recipe = computed (() => {
  //   const list = this.recipeList();
  //   if (!list) return null;

  //   return list.find(r => r.name === this.recipeName()) ?? null;
  // }
  // )

  addToShoppingList() {
    const currentRecipe = this.recipe();

    if (!currentRecipe) return;

    currentRecipe.ingredients.forEach(element => {
      this.shoppingListService.addIngredient(element)
    });
  }
  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.name());
    this.router.navigate(['/recipes']);
  }
}
