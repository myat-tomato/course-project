import { Injectable, signal } from "@angular/core"; //  FIX 1: Import Injectable
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient";
import { _ATTR_TO_PROP } from "@angular/compiler";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
    // private recipesList = signal<Recipe[]>([
    //     new Recipe(
    //         'Tasty Schnitzel',
    //         'A super-tasty Schnitzel - just awesome!',
    //         'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]),
    //     new Recipe('Big Fat Burger',
    //         'What else you need to say?',
    //         'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat', 1)
    //         ])
    // ]);

    private recipesList = signal<Recipe[]>([]);

    recipes = this.recipesList.asReadonly();

    setRecipes(recipes: Recipe[]){
        this.recipesList.set(recipes);
    }

    findRecipe(name: string){
        const recipe = this.recipesList().find(r => r.name.replace(/\s+/g, '') === name);
        return recipe;
    }

    addRecipe(newRecipe: Recipe) {
        this.recipesList.update(currentRecipes => {
            // Append the new recipe instance into a shallow copy array reference layout
            return [...currentRecipes, newRecipe];
        });
    }

    deleteRecipe(name : string){
        this.recipesList.update(currentList => {
            return currentList.filter((item) => item.name.replace(/\s+/g, '') !== name);
        });
    }

    updateRecipe(targetName: string, updatedRecipe: Recipe) {
        this.recipesList.update(currentRecipes => {
            // Map through the array to find the target recipe matching your URL string name
            return currentRecipes.map(recipe => {
                const matchName = recipe.name.replace(/\s+/g, '');
                
                // If it matches, return the updated recipe data payload. Otherwise, keep the old one.
                return matchName === targetName ? updatedRecipe : recipe;
            });
        });
    }
}
