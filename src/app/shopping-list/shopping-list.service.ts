import { Service, signal } from "@angular/core";

import { Ingredient } from "../shared/ingredient";

@Service()

export class ShoppingListService{
  private ingredientsList = signal<Ingredient[]>([
    new Ingredient('Egg', 3),
    new Ingredient('Flour', 1)
  ]);
  ingredients = this.ingredientsList.asReadonly();
  startedEditing = signal<number | null>(null);

  addIngredient(ingredient: Ingredient){
    this.ingredientsList.update(list => [...list, ingredient]);
  }
  getIngredient(index: number): Ingredient{
    return this.ingredientsList()[index];
  }

  deleteIngredient(index: number){
    this.ingredientsList.update((currentList) =>{
      return currentList.filter((_, itemIndex) => itemIndex !== index )
    })
  }

  updateIngredient(index: number, ingredient: Ingredient){
    this.ingredientsList.update((currentList) => {
      const updatedList = [...currentList]
      updatedList[+index] = ingredient
      return updatedList;
    })
  }
}