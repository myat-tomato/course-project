import { Component } from "@angular/core";
import { DropdownDirective } from "../shared/dropdown.directive";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'app-header',
    imports: [DropdownDirective, RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styleUrls: ['./header.css']
})

export class HeaderComponent{
  // isDropdownOpen = signal(false);
  // toggleDropdown() {
  //   this.isDropdownOpen.update(state => !state);
  // }
}