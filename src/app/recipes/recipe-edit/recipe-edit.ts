import { Component, input, signal, computed, inject, effect } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Ingredient } from '../../shared/ingredient';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-recipe-edit',
    standalone: true,
    templateUrl: './recipe-edit.html',
    styleUrl: './recipe-edit.css',
    imports: [ReactiveFormsModule]
})
export class RecipeEdit {
    //  Signal input from route parameters
    name = input.required<string>();
    recipeService = inject(RecipeService);
    router = inject(Router);
    route = inject(ActivatedRoute)

    //  FIX 1: Turn editRecipe into a computed signal so it waits safely for the input to resolve
    editRecipe = computed(() => {
        return this.recipeService.findRecipe(this.name());
    });

    editMode = computed(() => {
        return !!this.name();
    });

    ingredientsArray = new FormArray<FormGroup<{
        name: FormControl<string>;
        amount: FormControl<number | null>;
    }>>([]);

    recipeForm = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        imagePath: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        description: new FormControl('', { nonNullable: true }),
        ingredients: this.ingredientsArray
    });

    get ingredients() {
        return this.recipeForm.controls.ingredients;
    }

    constructor() {
        //  FIX 2: Create an effect to track when 'editRecipe' resolves, then populate the form dynamically!
        effect(() => {
            const recipe = this.editRecipe();

            if (recipe) {
                // A: Clear out any pre-existing input row artifacts first
                this.ingredientsArray.clear();

                // B: Fill out standard flat form entries
                this.recipeForm.patchValue({
                    name: recipe.name,
                    imagePath: recipe.imagePath,
                    description: recipe.description
                });

                // C: Loop through incoming data ingredients and dynamically mount groups to your FormArray
                if (recipe.ingredients) {
                    for (const ingredient of recipe.ingredients) {
                        this.ingredientsArray.push(
                            new FormGroup({
                                name: new FormControl(ingredient.name, { nonNullable: true, validators: [Validators.required] }),
                                amount: new FormControl<number | null>(ingredient.amount, [Validators.required, Validators.min(1)])
                            })
                        );
                    }
                }
            }
        });
    }

    onAddIngredient() {
        const ingredientRow = new FormGroup({
            name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
        });
        this.ingredientsArray.push(ingredientRow);
    }

    onDeleteIngredient(index: number) {
        this.ingredientsArray.removeAt(index);
    }

    onSubmit() {
        if (this.recipeForm.invalid) {
            return;
        }

        // Extract the form values. TypeScript knows its exact structure layout natively!
        const formValue = this.recipeForm.value;

        // Map your custom FormArray layout structure back into clean Ingredient models array
        const ingredientsPayload = (formValue.ingredients || []).map(
            ing => new Ingredient(ing.name ?? '', ing.amount ?? 0)
        );

        // Build your concrete new Recipe instance object
        const finalRecipeData = new Recipe(
            formValue.name ?? '',
            formValue.description ?? '',
            formValue.imagePath ?? '',
            ingredientsPayload
        );

        if (this.editMode()) {
            // 💡 UPDATE OPERATION: Target the original route name parameter and pass the fresh model
            this.recipeService.updateRecipe(this.name(), finalRecipeData);
            console.log('Recipe updated smoothly!');
        } else {
            // 💡 ADD OPERATION: Simply send the object off to create a new array item
            this.recipeService.addRecipe(finalRecipeData);
            console.log('New recipe added smoothly!');
        }

        // Optional: Clear or navigate away back to the detail panel view after saving
        this.onCancel();
    }


    onCancel() {
        this.recipeForm.reset();
        this.ingredientsArray.clear();
        this.router.navigate(['../'] , {relativeTo: this.route})
    }
}
