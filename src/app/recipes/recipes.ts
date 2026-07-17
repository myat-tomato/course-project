import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Recipe } from './recipe.model';
import { RecipeList } from './recipe-list/recipe-list';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  imports: [RecipeList, RouterOutlet],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  // initialize signal with null to satisfy required initial value
  recipeEl = signal<Recipe | null>(null);
  recipeService = inject(RecipeService);
}
