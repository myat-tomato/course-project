# Recipe Book — Angular 22 Course Project

A modern rewrite of the Angular course **Recipe Book** project using standalone components, signals, functional routing APIs, reactive forms, template-driven forms, and Firebase Realtime Database.

## Main Features

- View, create, edit, and delete recipes
- Add recipe ingredients to a shopping list
- Add, edit, and delete shopping-list items
- Save recipes to Firebase and fetch them again
- Navigate through nested recipe routes
- Open dropdown menus through a custom Angular directive

## Running the Project

This upload contains the `src` folder. Put it inside an Angular project, then run:

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

Bootstrap is used for styling, so the project should also include Bootstrap in its global styles or Angular configuration.

## Project Structure

```text
src/
├── main.ts                         # Starts the standalone Angular app
├── app/
│   ├── app.config.ts               # Global providers
│   ├── app.routes.ts               # Route definitions
│   ├── header/                     # Navigation and Firebase actions
│   ├── recipes/
│   │   ├── recipe-list/            # Recipe list and list items
│   │   ├── recipe-detail/          # Selected recipe details
│   │   ├── recipe-edit/            # Create/edit reactive form
│   │   ├── recipe.service.ts       # Recipe state and CRUD logic
│   │   └── recipes-resolver.service.ts
│   ├── shopping-list/
│   │   ├── shopping-edit/          # Template-driven form
│   │   └── shopping-list.service.ts
│   └── shared/
│       ├── data-storage.service.ts  # Firebase HTTP requests
│       ├── dropdown.directive.ts    # Custom dropdown behavior
│       └── ingredient.ts
```

## Angular Application Skeleton

### 1. Standalone Bootstrap

`main.ts` starts the root component without an `AppModule`:

```ts
bootstrapApplication(App, appConfig);
```

Each component imports the components, directives, router features, or form modules that its own template uses.

### 2. Global Providers

`app.config.ts` registers application-wide Angular features:

```ts
provideRouter(routes, withComponentInputBinding())
```

- `provideRouter(routes)` enables routing.
- `withComponentInputBinding()` sends route parameters directly into matching component inputs.
- `provideBrowserGlobalErrorListeners()` connects browser errors to Angular error handling.

HTTP also needs to be registered here:

```ts
import { provideHttpClient } from '@angular/common/http';

providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes, withComponentInputBinding()),
  provideHttpClient()
]
```

### 3. Routing

The application uses:

- A redirect from `/` to `/recipes`
- Child routes rendered inside the recipes `<router-outlet>`
- A dynamic `:name` route parameter
- Relative navigation
- A route resolver

```text
/recipes             Recipe start screen
/recipes/new         Create a recipe
/recipes/:name       Recipe details
/recipes/:name/edit  Edit a recipe
/shopping-list       Shopping list
```

The resolver fetches recipes before the recipes page opens when the service has no data. Angular waits for the returned array or `Observable` before activating the route.

### 4. Dependency Injection and Services

Services contain shared state and business logic. Components access them with `inject()`:

```ts
recipeService = inject(RecipeService);
```

`RecipeService` manages recipes, `ShoppingListService` manages ingredients, and `DataStorageService` communicates with Firebase.

A root service should use:

```ts
@Injectable({ providedIn: 'root' })
export class ShoppingListService {}
```

The current `@Service()` decorator in `shopping-list.service.ts` should be replaced with `@Injectable(...)`.

## Signals and Reactive State

Signals are the main local and shared-state mechanism in this project.

```ts
private recipesList = signal<Recipe[]>([]);
recipes = this.recipesList.asReadonly();
```

- `signal(value)` creates writable reactive state.
- Reading uses `recipes()`.
- `set(value)` replaces the value.
- `update(current => newValue)` calculates the next value.
- `asReadonly()` lets components read state without changing it directly.
- `computed()` derives a value from other signals.
- `effect()` runs side-effect code whenever the signals it reads change.

Examples include finding the selected recipe, detecting shopping-list edit mode, filling forms, and controlling dropdown visibility.

## Component Inputs and Template Binding

Modern signal inputs are used instead of the older `@Input()` style:

```ts
recipe = input.required<Recipe>();
```

Templates read signal inputs with `recipe()`.

The project also demonstrates:

```html
{{ recipe().name }}              <!-- Interpolation -->
[src]="recipe().imagePath"       <!-- Property binding -->
(click)="onDeleteRecipe()"       <!-- Event binding -->
[(ngModel)]="name"              <!-- Two-way binding -->
```

Modern template control flow is used:

```html
@if (editMode()) { ... }
@for (item of items(); track $index) { ... }
```

Because `RecipeEdit` handles both `/new` and `/:name/edit`, its route input should be optional rather than required:

```ts
name = input<string | undefined>();
```

## Forms

### Reactive Form — Recipe Editor

`RecipeEdit` builds the form structure in TypeScript with:

- `FormGroup` for the complete recipe
- `FormControl` for normal fields
- `FormArray` for a dynamic ingredient list
- `Validators.required` and `Validators.min(1)`
- `patchValue()` when loading an existing recipe

The template connects through `[formGroup]`, `formControlName`, `formArrayName`, and `[formGroupName]`.

The **Add Ingredient** button should use `type="button"` so it does not accidentally submit the form.

### Template-Driven Form — Shopping List

`ShoppingEdit` uses `FormsModule`, `NgForm`, `[(ngModel)]`, HTML validation attributes, and `(ngSubmit)`.

This form style is convenient for smaller forms, while reactive forms are better for larger or dynamic structures.

## HTTP and Observables

`HttpClient` methods return RxJS `Observable` values.

```ts
this.http.get<Recipe[]>(url).pipe(
  map(...),
  tap(...)
);
```

An `Observable` represents data that may arrive later. The HTTP request starts when Angular subscribes to it.

- `get()` fetches recipes.
- `put()` replaces the recipes stored at Firebase's `/recipes.json` endpoint.
- `pipe()` attaches RxJS operators.
- `map()` transforms the received data.
- `tap()` performs a side effect without replacing the emitted value; here it updates `RecipeService`.
- `subscribe()` executes the request when called manually.

The resolver can return the fetch `Observable` directly, so the router subscribes and waits automatically.

## Custom Dropdown Directive

`DropdownDirective` adds reusable behavior to any element with `appDropdown`.

- `@HostListener('document:click')` listens for page clicks.
- `@HostBinding('class.show')` toggles a class on the host element.
- `ElementRef` accesses the host DOM element.
- `Renderer2` safely adds or removes the Bootstrap `show` class.
- `effect()` synchronizes the signal state with the inner dropdown menu.

## Main Data Flow

```text
Component
   ↓ calls
RecipeService / ShoppingListService
   ↓ state exposed as readonly signals
Templates update automatically

Header or Route Resolver
   ↓
DataStorageService
   ↓ HttpClient Observable
Firebase Realtime Database
   ↓ tap()
RecipeService.setRecipes()
```