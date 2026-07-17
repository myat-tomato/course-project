import { Component, signal, inject, computed, effect } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Ingredient } from '../../shared/ingredient';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  standalone: true,
  selector: 'app-shopping-edit',
  imports: [FormsModule],
  templateUrl: './shopping-edit.html',
  styleUrl: './shopping-edit.css',
})
export class ShoppingEdit {
  name = signal('');
  amount = signal(0);
  shoppingListService = inject(ShoppingListService);

  index = computed(() => {
    return this.shoppingListService.startedEditing()
  })

  editMode = computed((): boolean => {
    const index = this.shoppingListService.startedEditing();
    return index != null && index != undefined;
  })

  editedItem = computed(() => {
    const index = this.shoppingListService.startedEditing();
    if (index === null || index === undefined) {
      return null;
    }
    return this.shoppingListService.getIngredient(index);
  })

  constructor() {
    effect(() => {
      const item = this.editedItem()
      if (item) {
        this.name.set(item.name);
        this.amount.set(item.amount);
      } else {
        this.name.set('');
        this.amount.set(0);
      }
    })
  }

  onClear(form : NgForm){
    this.shoppingListService.startedEditing.set(null);
    form.reset();
  }

  onDelete(form : NgForm){
    const activeIndex = this.index();
    if(activeIndex !== null && activeIndex !== undefined){
      this.shoppingListService.deleteIngredient(activeIndex);
    }
    this.shoppingListService.startedEditing.set(null);
    form.reset()
  }

  onSubmit(form : NgForm) {
    const activeIndex = this.index();
    const item = this.editedItem();
    if (this.editMode() && activeIndex !== null && activeIndex !== undefined && item) {
      const updatedItem = new Ingredient(this.name(), this.amount());
      this.shoppingListService.updateIngredient(activeIndex, updatedItem);
      this.shoppingListService.startedEditing.set(null);
    } else {
      this.shoppingListService.addIngredient(new Ingredient(this.name(), this.amount()));
    }
    form.resetForm()
  }
}
