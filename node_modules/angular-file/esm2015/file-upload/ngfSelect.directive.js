import { __decorate } from "tslib";
import { Directive, Input } from "@angular/core";
import { ngf } from "./ngf.directive";
let ngfSelect = class ngfSelect extends ngf {
    constructor() {
        super(...arguments);
        this.selectable = true;
    }
};
__decorate([
    Input()
], ngfSelect.prototype, "selectable", void 0);
ngfSelect = __decorate([
    Directive({
        selector: "[ngfSelect]",
        exportAs: "ngfSelect"
    })
], ngfSelect);
export { ngfSelect };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmU2VsZWN0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZlNlbGVjdC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQU1yQyxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFVLFNBQVEsR0FBRztJQUFsQzs7UUFDVyxlQUFVLEdBQU8sSUFBSSxDQUFBO0lBQ2hDLENBQUM7Q0FBQSxDQUFBO0FBRFU7SUFBUixLQUFLLEVBQUU7NkNBQXNCO0FBRG5CLFNBQVM7SUFKckIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLFdBQVc7S0FDdEIsQ0FBQztHQUNXLFNBQVMsQ0FFckI7U0FGWSxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCJcbmltcG9ydCB7IG5nZiB9IGZyb20gXCIuL25nZi5kaXJlY3RpdmVcIlxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IFwiW25nZlNlbGVjdF1cIixcbiAgZXhwb3J0QXM6IFwibmdmU2VsZWN0XCJcbn0pXG5leHBvcnQgY2xhc3MgbmdmU2VsZWN0IGV4dGVuZHMgbmdmIHtcbiAgQElucHV0KCkgc2VsZWN0YWJsZTphbnkgPSB0cnVlXG59Il19