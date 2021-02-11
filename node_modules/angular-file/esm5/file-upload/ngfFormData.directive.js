import { __decorate } from "tslib";
import { IterableDiffer, IterableDiffers, Directive, EventEmitter, Output, Input } from '@angular/core';
var ngfFormData = /** @class */ (function () {
    function ngfFormData(IterableDiffers) {
        this.postName = "file";
        this.FormData = new FormData();
        this.FormDataChange = new EventEmitter();
        this.differ = IterableDiffers.find([]).create();
    }
    ngfFormData.prototype.ngDoCheck = function () {
        var _this = this;
        var changes = this.differ.diff(this.files);
        if (changes) {
            setTimeout(function () { return _this.buildFormData(); }, 0);
        }
    };
    ngfFormData.prototype.buildFormData = function () {
        var _this = this;
        var isArray = typeof (this.files) === 'object' && this.files.constructor === Array;
        if (isArray) {
            this.FormData = new FormData();
            var files = this.files || [];
            files.forEach(function (file) {
                return _this.FormData.append(_this.postName, file, _this.fileName || file.name);
            });
            this.FormDataChange.emit(this.FormData);
        }
        else {
            delete this.FormData;
        }
    };
    ngfFormData.ctorParameters = function () { return [
        { type: IterableDiffers }
    ]; };
    __decorate([
        Input()
    ], ngfFormData.prototype, "files", void 0);
    __decorate([
        Input()
    ], ngfFormData.prototype, "postName", void 0);
    __decorate([
        Input()
    ], ngfFormData.prototype, "fileName", void 0);
    __decorate([
        Input()
    ], ngfFormData.prototype, "FormData", void 0);
    __decorate([
        Output()
    ], ngfFormData.prototype, "FormDataChange", void 0);
    ngfFormData = __decorate([
        Directive({ selector: 'ngfFormData' })
    ], ngfFormData);
    return ngfFormData;
}());
export { ngfFormData };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmRm9ybURhdGEuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1maWxlLyIsInNvdXJjZXMiOlsiZmlsZS11cGxvYWQvbmdmRm9ybURhdGEuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixTQUFTLEVBQUUsWUFBWSxFQUN2QixNQUFNLEVBQUUsS0FBSyxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBR3ZCO0lBVUUscUJBQVksZUFBZ0M7UUFSbkMsYUFBUSxHQUFVLE1BQU0sQ0FBQTtRQUd4QixhQUFRLEdBQVksSUFBSSxRQUFRLEVBQUUsQ0FBQTtRQUNqQyxtQkFBYyxHQUEwQixJQUFJLFlBQVksRUFBRSxDQUFBO1FBS2xFLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUNqRCxDQUFDO0lBRUQsK0JBQVMsR0FBVDtRQUFBLGlCQU1DO1FBTEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBRTdDLElBQUksT0FBTyxFQUFFO1lBQ1gsVUFBVSxDQUFDLGNBQUksT0FBQSxLQUFJLENBQUMsYUFBYSxFQUFFLEVBQXBCLENBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDeEM7SUFDSCxDQUFDO0lBRUQsbUNBQWEsR0FBYjtRQUFBLGlCQWFDO1FBWkMsSUFBTSxPQUFPLEdBQUcsT0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBRyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUcsS0FBSyxDQUFBO1FBRS9FLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFBO1lBQzlCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFBO1lBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNoQixPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUksQ0FBQyxRQUFRLElBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFuRSxDQUFtRSxDQUNwRSxDQUFBO1lBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFBO1NBQzFDO2FBQUk7WUFDSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7U0FDckI7SUFDSCxDQUFDOztnQkF6QjRCLGVBQWU7O0lBVG5DO1FBQVIsS0FBSyxFQUFFOzhDQUFnQjtJQUNmO1FBQVIsS0FBSyxFQUFFO2lEQUF5QjtJQUN4QjtRQUFSLEtBQUssRUFBRTtpREFBbUI7SUFFbEI7UUFBUixLQUFLLEVBQUU7aURBQW1DO0lBQ2pDO1FBQVQsTUFBTSxFQUFFO3VEQUEyRDtJQU56RCxXQUFXO1FBRHZCLFNBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUMsQ0FBQztPQUN4QixXQUFXLENBb0N2QjtJQUFELGtCQUFDO0NBQUEsQUFwQ0QsSUFvQ0M7U0FwQ1ksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEl0ZXJhYmxlRGlmZmVyLFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLFxuICBPdXRwdXQsIElucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nZkZvcm1EYXRhJ30pXG5leHBvcnQgY2xhc3MgbmdmRm9ybURhdGEge1xuICBASW5wdXQoKSBmaWxlcyAhOiBGaWxlW11cbiAgQElucHV0KCkgcG9zdE5hbWU6c3RyaW5nID0gXCJmaWxlXCJcbiAgQElucHV0KCkgZmlsZU5hbWUgITogc3RyaW5nLy9mb3JjZSBmaWxlIG5hbWVcblxuICBASW5wdXQoKSBGb3JtRGF0YTpGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gIEBPdXRwdXQoKSBGb3JtRGF0YUNoYW5nZTpFdmVudEVtaXR0ZXI8Rm9ybURhdGE+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgZGlmZmVyOkl0ZXJhYmxlRGlmZmVyPHt9PlxuXG4gIGNvbnN0cnVjdG9yKEl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzKXtcbiAgICB0aGlzLmRpZmZlciA9IEl0ZXJhYmxlRGlmZmVycy5maW5kKFtdKS5jcmVhdGUoKVxuICB9XG5cbiAgbmdEb0NoZWNrKCl7XG4gICAgdmFyIGNoYW5nZXMgPSB0aGlzLmRpZmZlci5kaWZmKCB0aGlzLmZpbGVzICk7XG5cbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgc2V0VGltZW91dCgoKT0+dGhpcy5idWlsZEZvcm1EYXRhKCksIDApXG4gICAgfVxuICB9XG5cbiAgYnVpbGRGb3JtRGF0YSgpe1xuICAgIGNvbnN0IGlzQXJyYXkgPSB0eXBlb2YodGhpcy5maWxlcyk9PT0nb2JqZWN0JyAmJiB0aGlzLmZpbGVzLmNvbnN0cnVjdG9yPT09QXJyYXlcblxuICAgIGlmKCBpc0FycmF5ICl7XG4gICAgICB0aGlzLkZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5maWxlcyB8fCBbXVxuICAgICAgZmlsZXMuZm9yRWFjaChmaWxlPT5cbiAgICAgICAgdGhpcy5Gb3JtRGF0YS5hcHBlbmQodGhpcy5wb3N0TmFtZSwgZmlsZSwgdGhpcy5maWxlTmFtZXx8ZmlsZS5uYW1lKVxuICAgICAgKVxuICAgICAgdGhpcy5Gb3JtRGF0YUNoYW5nZS5lbWl0KCB0aGlzLkZvcm1EYXRhIClcbiAgICB9ZWxzZXtcbiAgICAgIGRlbGV0ZSB0aGlzLkZvcm1EYXRhXG4gICAgfVxuICB9XG59Il19