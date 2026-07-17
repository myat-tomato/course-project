import { Component, inject } from '@angular/core';

import { RecipeItem } from './recipe-item/recipe-item';
import { RecipeService } from '../recipe.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeItem, RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList {
  recipes = inject(RecipeService).recipes;
}
