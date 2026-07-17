import { Component, inject, input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-recipe-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './recipe-item.html',
  styleUrls: ['./recipe-item.css'],
})
export class RecipeItem {
  recipeService = inject(RecipeService);
  recipe = input.required<Recipe>();
}
