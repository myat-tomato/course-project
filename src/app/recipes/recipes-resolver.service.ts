import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn: 'root'
})

export class RecipesResolverService implements Resolve<Recipe[]> {
    private dataStorage = inject(DataStorageService);
    private recipeService = inject(RecipeService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const recipes = this.recipeService.recipes()
        if(recipes.length === 0){
            return this.dataStorage.fetchRecipes();
        } else {
            return recipes
        }
    }
}