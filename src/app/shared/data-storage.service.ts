import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
}
)

export class DataStorageService {
    private http = inject(HttpClient)
    private recipeService = inject(RecipeService);

    storeRecipes() {
        const recipes = this.recipeService.recipes();
        this.http.put(
            'https://ng-course-recipe-book-ec776-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
            recipes)
            .subscribe(res => {
                console.log(res);
            });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(
            'https://ng-course-recipe-book-ec776-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
        ).pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes)
            })
        )
    }
}