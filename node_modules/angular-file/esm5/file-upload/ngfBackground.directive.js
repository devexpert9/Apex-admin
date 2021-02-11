import { __decorate } from "tslib";
import { Directive, ElementRef, Input } from '@angular/core';
import { dataUrl } from './fileTools';
var ngfBackground = /** @class */ (function () {
    function ngfBackground(ElementRef) {
        this.ElementRef = ElementRef;
    }
    ngfBackground.prototype.ngOnChanges = function (_changes) {
        var _this = this;
        dataUrl(this.file)
            .then(function (src) {
            var urlString = 'url(\'' + (src || '') + '\')';
            _this.ElementRef.nativeElement.style.backgroundImage = urlString;
        });
    };
    ngfBackground.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input('ngfBackground')
    ], ngfBackground.prototype, "file", void 0);
    ngfBackground = __decorate([
        Directive({ selector: '[ngfBackground]' })
    ], ngfBackground);
    return ngfBackground;
}());
export { ngfBackground };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmQmFja2dyb3VuZC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWZpbGUvIiwic291cmNlcyI6WyJmaWxlLXVwbG9hZC9uZ2ZCYWNrZ3JvdW5kLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFHdEM7SUFHRSx1QkFBbUIsVUFBcUI7UUFBckIsZUFBVSxHQUFWLFVBQVUsQ0FBVztJQUFFLENBQUM7SUFFM0MsbUNBQVcsR0FBWCxVQUFhLFFBQVk7UUFBekIsaUJBTUM7UUFMQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNqQixJQUFJLENBQUMsVUFBQSxHQUFHO1lBQ1AsSUFBTSxTQUFTLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQTtZQUNoRCxLQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQTtRQUNqRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7O2dCQVI2QixVQUFVOztJQUZoQjtRQUF2QixLQUFLLENBQUMsZUFBZSxDQUFDOytDQUFTO0lBRHJCLGFBQWE7UUFEekIsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7T0FDNUIsYUFBYSxDQVl6QjtJQUFELG9CQUFDO0NBQUEsQUFaRCxJQVlDO1NBWlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGRhdGFVcmwgfSBmcm9tICcuL2ZpbGVUb29scyc7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nZkJhY2tncm91bmRdJ30pXG5leHBvcnQgY2xhc3MgbmdmQmFja2dyb3VuZCB7XG4gIEBJbnB1dCgnbmdmQmFja2dyb3VuZCcpIGZpbGU6YW55XG5cbiAgY29uc3RydWN0b3IocHVibGljIEVsZW1lbnRSZWY6RWxlbWVudFJlZil7fVxuXG4gIG5nT25DaGFuZ2VzKCBfY2hhbmdlczphbnkgKXtcbiAgICBkYXRhVXJsKHRoaXMuZmlsZSlcbiAgICAudGhlbihzcmM9PntcbiAgICAgIGNvbnN0IHVybFN0cmluZyA9ICd1cmwoXFwnJyArIChzcmMgfHwgJycpICsgJ1xcJyknXG4gICAgICB0aGlzLkVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSB1cmxTdHJpbmdcbiAgICB9KVxuICB9XG59XG4iXX0=