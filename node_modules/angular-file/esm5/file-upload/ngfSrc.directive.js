import { __decorate } from "tslib";
import { Directive, ElementRef, Input } from '@angular/core';
import { dataUrl } from './fileTools';
var ngfSrc = /** @class */ (function () {
    function ngfSrc(ElementRef) {
        this.ElementRef = ElementRef;
    }
    ngfSrc.prototype.ngOnChanges = function (_changes) {
        var _this = this;
        dataUrl(this.file)
            .then(function (src) {
            return _this.ElementRef.nativeElement.src = src;
        });
    };
    ngfSrc.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input('ngfSrc')
    ], ngfSrc.prototype, "file", void 0);
    ngfSrc = __decorate([
        Directive({ selector: '[ngfSrc]' })
    ], ngfSrc);
    return ngfSrc;
}());
export { ngfSrc };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmU3JjLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZlNyYy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR3RDO0lBR0UsZ0JBQW1CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBSSxDQUFDO0lBRTlDLDRCQUFXLEdBQVgsVUFBWSxRQUFhO1FBQXpCLGlCQUtDO1FBSkMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDakIsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUNQLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLEdBQUc7UUFBdkMsQ0FBdUMsQ0FDeEMsQ0FBQTtJQUNILENBQUM7O2dCQVA4QixVQUFVOztJQUZ4QjtRQUFoQixLQUFLLENBQUMsUUFBUSxDQUFDO3dDQUFVO0lBRGYsTUFBTTtRQURsQixTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUM7T0FDdkIsTUFBTSxDQVdsQjtJQUFELGFBQUM7Q0FBQSxBQVhELElBV0M7U0FYWSxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZGF0YVVybCB9IGZyb20gJy4vZmlsZVRvb2xzJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nZlNyY10nIH0pXG5leHBvcnQgY2xhc3MgbmdmU3JjIHtcbiAgQElucHV0KCduZ2ZTcmMnKSBmaWxlOiBhbnlcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgRWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG5cbiAgbmdPbkNoYW5nZXMoX2NoYW5nZXM6IGFueSkge1xuICAgIGRhdGFVcmwodGhpcy5maWxlKVxuICAgIC50aGVuKHNyYz0+XG4gICAgICB0aGlzLkVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zcmMgPSBzcmNcbiAgICApXG4gIH1cbn1cbiJdfQ==