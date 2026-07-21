import { Component, inject } from "@angular/core";
import { DropdownDirective } from "../shared/dropdown.directive";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: 'app-header',
  imports: [DropdownDirective, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})

export class HeaderComponent {
  // isDropdownOpen = signal(false);
  // toggleDropdown() {
  //   this.isDropdownOpen.update(state => !state);
  // }

  private dataStorage = inject(DataStorageService);

  saveData(){
    this.dataStorage.storeRecipes();
  }

  fetchData(){
    this.dataStorage.fetchRecipes().subscribe();
  }
}