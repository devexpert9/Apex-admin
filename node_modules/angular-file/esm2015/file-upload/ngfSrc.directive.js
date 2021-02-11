import { __decorate } from "tslib";
import { Directive, ElementRef, Input } from '@angular/core';
import { dataUrl } from './fileTools';
let ngfSrc = class ngfSrc {
    constructor(ElementRef) {
        this.ElementRef = ElementRef;
    }
    ngOnChanges(_changes) {
        dataUrl(this.file)
            .then(src => this.ElementRef.nativeElement.src = src);
    }
};
ngfSrc.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input('ngfSrc')
], ngfSrc.prototype, "file", void 0);
ngfSrc = __decorate([
    Directive({ selector: '[ngfSrc]' })
], ngfSrc);
export { ngfSrc };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmU3JjLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZlNyYy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR3RDLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU07SUFHakIsWUFBbUIsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFJLENBQUM7SUFFOUMsV0FBVyxDQUFDLFFBQWE7UUFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQSxFQUFFLENBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FDeEMsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBOztZQVJnQyxVQUFVOztBQUZ4QjtJQUFoQixLQUFLLENBQUMsUUFBUSxDQUFDO29DQUFVO0FBRGYsTUFBTTtJQURsQixTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUM7R0FDdkIsTUFBTSxDQVdsQjtTQVhZLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBkYXRhVXJsIH0gZnJvbSAnLi9maWxlVG9vbHMnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmdmU3JjXScgfSlcbmV4cG9ydCBjbGFzcyBuZ2ZTcmMge1xuICBASW5wdXQoJ25nZlNyYycpIGZpbGU6IGFueVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBFbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cblxuICBuZ09uQ2hhbmdlcyhfY2hhbmdlczogYW55KSB7XG4gICAgZGF0YVVybCh0aGlzLmZpbGUpXG4gICAgLnRoZW4oc3JjPT5cbiAgICAgIHRoaXMuRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNyYyA9IHNyY1xuICAgIClcbiAgfVxufVxuIl19