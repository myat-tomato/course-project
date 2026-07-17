import { 
    Directive, 
    ElementRef, 
    HostBinding, 
    HostListener, 
    inject, 
    Renderer2, 
    signal,
    effect
} from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    private elRef = inject(ElementRef);
    private renderer = inject(Renderer2);
    isShow = signal(false);

    // This applies .show to the parent <li> container
    @HostBinding('class.show') 
    get show() {
        return this.isShow();
    }

    constructor() {
        // Automatically syncs the state with the inner <ul> element
        effect(() => {
            const menuElement = this.elRef.nativeElement.querySelector('.dropdown-menu');
            if (menuElement) {
                if (this.isShow()) {
                    this.renderer.addClass(menuElement, 'show');
                } else {
                    this.renderer.removeClass(menuElement, 'show');
                }
            }
        });
    }

    @HostListener('document:click', ['$event'])
    toggleOpen(event: Event) {
        this.isShow.set(
            this.elRef.nativeElement.contains(event.target) 
                ? !this.isShow() 
                : false
        );
    }
}
