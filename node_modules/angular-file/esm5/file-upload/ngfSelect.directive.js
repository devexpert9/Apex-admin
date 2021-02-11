import { __decorate, __extends } from "tslib";
import { Directive, Input } from "@angular/core";
import { ngf } from "./ngf.directive";
var ngfSelect = /** @class */ (function (_super) {
    __extends(ngfSelect, _super);
    function ngfSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectable = true;
        return _this;
    }
    __decorate([
        Input()
    ], ngfSelect.prototype, "selectable", void 0);
    ngfSelect = __decorate([
        Directive({
            selector: "[ngfSelect]",
            exportAs: "ngfSelect"
        })
    ], ngfSelect);
    return ngfSelect;
}(ngf));
export { ngfSelect };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmU2VsZWN0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZlNlbGVjdC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQU1yQztJQUErQiw2QkFBRztJQUFsQztRQUFBLHFFQUVDO1FBRFUsZ0JBQVUsR0FBTyxJQUFJLENBQUE7O0lBQ2hDLENBQUM7SUFEVTtRQUFSLEtBQUssRUFBRTtpREFBc0I7SUFEbkIsU0FBUztRQUpyQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUsV0FBVztTQUN0QixDQUFDO09BQ1csU0FBUyxDQUVyQjtJQUFELGdCQUFDO0NBQUEsQUFGRCxDQUErQixHQUFHLEdBRWpDO1NBRlksU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiXG5pbXBvcnQgeyBuZ2YgfSBmcm9tIFwiLi9uZ2YuZGlyZWN0aXZlXCJcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBcIltuZ2ZTZWxlY3RdXCIsXG4gIGV4cG9ydEFzOiBcIm5nZlNlbGVjdFwiXG59KVxuZXhwb3J0IGNsYXNzIG5nZlNlbGVjdCBleHRlbmRzIG5nZiB7XG4gIEBJbnB1dCgpIHNlbGVjdGFibGU6YW55ID0gdHJ1ZVxufSJdfQ==