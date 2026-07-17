import { Routes } from '@angular/router';

import { Recipes } from './recipes/recipes';
import { ShoppingList } from './shopping-list/shopping-list';
import { HeaderComponent } from './header/header';
import { RecipeDetail } from './recipes/recipe-detail/recipe-detail';
import { RecipeStart } from './recipes/recipe-start/recipe-start';
import { RecipeEdit } from './recipes/recipe-edit/recipe-edit';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/recipes',
        pathMatch: 'full'
    },
    {
        path: 'recipes',
        component: Recipes,
        children: [{
            path: '',
            component: RecipeStart
        },
                {
            path: 'new',
            component: RecipeEdit
        },
        {
            path: ':name',
            component: RecipeDetail
        },
        {
            path: ':name/edit',
            component: RecipeEdit
        }]
    },
    {
        path: 'shopping-list',
        component: ShoppingList
    }
];
