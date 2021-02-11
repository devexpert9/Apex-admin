import { __decorate } from "tslib";
import { Directive, EventEmitter, Output, Input } from '@angular/core';
var ngfUploadStatus = /** @class */ (function () {
    function ngfUploadStatus() {
        this.percent = 0;
        this.percentChange = new EventEmitter();
    }
    ngfUploadStatus.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.httpEvent && changes.httpEvent.currentValue) {
            var event_1 = changes.httpEvent.currentValue;
            if (event_1.loaded && event_1.total) {
                setTimeout(function () {
                    _this.percent = Math.round(100 * event_1.loaded / event_1.total);
                    _this.percentChange.emit(_this.percent);
                }, 0);
            }
        }
    };
    __decorate([
        Input()
    ], ngfUploadStatus.prototype, "percent", void 0);
    __decorate([
        Output()
    ], ngfUploadStatus.prototype, "percentChange", void 0);
    __decorate([
        Input()
    ], ngfUploadStatus.prototype, "httpEvent", void 0);
    ngfUploadStatus = __decorate([
        Directive({ selector: 'ngfUploadStatus' })
    ], ngfUploadStatus);
    return ngfUploadStatus;
}());
export { ngfUploadStatus };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmVXBsb2FkU3RhdHVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZlVwbG9hZFN0YXR1cy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdkU7SUFBQTtRQUNXLFlBQU8sR0FBVSxDQUFDLENBQUE7UUFDakIsa0JBQWEsR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQTtJQWNuRSxDQUFDO0lBWEMscUNBQVcsR0FBWCxVQUFhLE9BQU87UUFBcEIsaUJBVUM7UUFUQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUU7WUFDdkQsSUFBTSxPQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUE7WUFDNUMsSUFBSSxPQUFLLENBQUMsTUFBTSxJQUFJLE9BQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQy9CLFVBQVUsQ0FBQztvQkFDVCxLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE9BQUssQ0FBQyxNQUFNLEdBQUcsT0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSxLQUFJLENBQUMsT0FBTyxDQUFFLENBQUE7Z0JBQ3pDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUNOO1NBQ0Y7SUFDSCxDQUFDO0lBZFE7UUFBUixLQUFLLEVBQUU7b0RBQW1CO0lBQ2pCO1FBQVQsTUFBTSxFQUFFOzBEQUF3RDtJQUN4RDtRQUFSLEtBQUssRUFBRTtzREFBbUI7SUFIaEIsZUFBZTtRQUQzQixTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztPQUM1QixlQUFlLENBZ0IzQjtJQUFELHNCQUFDO0NBQUEsQUFoQkQsSUFnQkM7U0FoQlksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmdmVXBsb2FkU3RhdHVzJ30pXG5leHBvcnQgY2xhc3MgbmdmVXBsb2FkU3RhdHVzIHtcbiAgQElucHV0KCkgcGVyY2VudDpudW1iZXIgPSAwXG4gIEBPdXRwdXQoKSBwZXJjZW50Q2hhbmdlOkV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gIEBJbnB1dCgpIGh0dHBFdmVudCAhOiBFdmVudFxuXG4gIG5nT25DaGFuZ2VzKCBjaGFuZ2VzICl7XG4gICAgaWYoIGNoYW5nZXMuaHR0cEV2ZW50ICYmIGNoYW5nZXMuaHR0cEV2ZW50LmN1cnJlbnRWYWx1ZSApe1xuICAgICAgY29uc3QgZXZlbnQgPSBjaGFuZ2VzLmh0dHBFdmVudC5jdXJyZW50VmFsdWVcbiAgICAgIGlmIChldmVudC5sb2FkZWQgJiYgZXZlbnQudG90YWwpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgIHRoaXMucGVyY2VudCA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xuICAgICAgICAgIHRoaXMucGVyY2VudENoYW5nZS5lbWl0KCB0aGlzLnBlcmNlbnQgKVxuICAgICAgICB9LCAwKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSJdfQ==