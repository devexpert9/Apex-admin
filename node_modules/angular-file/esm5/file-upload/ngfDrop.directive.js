import { __decorate, __extends } from "tslib";
import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ngf } from "./ngf.directive";
var ngfDrop = /** @class */ (function (_super) {
    __extends(ngfDrop, _super);
    function ngfDrop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileOver = new EventEmitter();
        _this.validDrag = false;
        _this.validDragChange = new EventEmitter();
        _this.invalidDrag = false;
        _this.invalidDragChange = new EventEmitter();
        _this.dragFilesChange = new EventEmitter();
        return _this;
    }
    ngfDrop.prototype.onDrop = function (event) {
        if (this.fileDropDisabled) {
            this.stopEvent(event);
            return;
        }
        this.closeDrags();
        var files = this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    };
    ngfDrop.prototype.handleFiles = function (files) {
        this.fileOver.emit(false); //turn-off dragover
        _super.prototype.handleFiles.call(this, files);
    };
    ngfDrop.prototype.onDragOver = function (event) {
        if (this.fileDropDisabled) {
            this.stopEvent(event);
            return;
        }
        var transfer = this.eventToTransfer(event);
        var files = this.eventToFiles(event);
        var jsonFiles = this.filesToWriteableObject(files);
        this.dragFilesChange.emit(this.dragFiles = jsonFiles);
        if (files.length) {
            this.validDrag = this.isFilesValid(files);
        }
        else {
            //Safari, IE11 & some browsers do NOT tell you about dragged files until dropped. Always consider a valid drag
            this.validDrag = true;
        }
        this.validDragChange.emit(this.validDrag);
        this.invalidDrag = !this.validDrag;
        this.invalidDragChange.emit(this.invalidDrag);
        transfer.dropEffect = 'copy'; //change cursor and such
        this.stopEvent(event);
        this.fileOver.emit(true);
    };
    ngfDrop.prototype.closeDrags = function () {
        delete this.validDrag;
        this.validDragChange.emit(this.validDrag);
        this.invalidDrag = false;
        this.invalidDragChange.emit(this.invalidDrag);
        delete this.dragFiles;
        this.dragFilesChange.emit(this.dragFiles);
    };
    ngfDrop.prototype.onDragLeave = function (event) {
        if (this.fileDropDisabled) {
            this.stopEvent(event);
            return;
        }
        this.closeDrags();
        if (this.element) {
            if (event.currentTarget === this.element[0]) {
                return;
            }
        }
        this.stopEvent(event);
        this.fileOver.emit(false);
    };
    __decorate([
        Output()
    ], ngfDrop.prototype, "fileOver", void 0);
    __decorate([
        Input()
    ], ngfDrop.prototype, "validDrag", void 0);
    __decorate([
        Output()
    ], ngfDrop.prototype, "validDragChange", void 0);
    __decorate([
        Input()
    ], ngfDrop.prototype, "invalidDrag", void 0);
    __decorate([
        Output()
    ], ngfDrop.prototype, "invalidDragChange", void 0);
    __decorate([
        Input()
    ], ngfDrop.prototype, "dragFiles", void 0);
    __decorate([
        Output()
    ], ngfDrop.prototype, "dragFilesChange", void 0);
    __decorate([
        HostListener('drop', ['$event'])
    ], ngfDrop.prototype, "onDrop", null);
    __decorate([
        HostListener('dragover', ['$event'])
    ], ngfDrop.prototype, "onDragOver", null);
    __decorate([
        HostListener('dragleave', ['$event'])
    ], ngfDrop.prototype, "onDragLeave", null);
    ngfDrop = __decorate([
        Directive({
            selector: "[ngfDrop]",
            exportAs: "ngfDrop"
        })
    ], ngfDrop);
    return ngfDrop;
}(ngf));
export { ngfDrop };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmRHJvcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWZpbGUvIiwic291cmNlcyI6WyJmaWxlLXVwbG9hZC9uZ2ZEcm9wLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxZQUFZLEVBQ3ZCLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUM1QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsR0FBRyxFQUFZLE1BQU0saUJBQWlCLENBQUE7QUFNL0M7SUFBNkIsMkJBQUc7SUFBaEM7UUFBQSxxRUEyRkM7UUExRlcsY0FBUSxHQUFxQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGVBQVMsR0FBVyxLQUFLLENBQUE7UUFDeEIscUJBQWUsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUUzRCxpQkFBVyxHQUFHLEtBQUssQ0FBQTtRQUNsQix1QkFBaUIsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUc1RCxxQkFBZSxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFBOztJQWlGekUsQ0FBQztJQTlFQyx3QkFBTSxHQUFOLFVBQU8sS0FBVztRQUNoQixJQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBQztZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLE9BQU07U0FDUDtRQUVELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNqQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRXBDLElBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUFDLE9BQU07UUFFdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3pCLENBQUM7SUFFRCw2QkFBVyxHQUFYLFVBQVksS0FBWTtRQUN0QixJQUFJ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QUFFO29EQUE4RDtJQUd2RTtRQURDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzt5Q0FjaEM7SUFRRDtRQURDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs2Q0E2QnBDO0lBWUQ7UUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7OENBaUJyQztJQTFGVSxPQUFPO1FBSm5CLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQUM7T0FDVyxPQUFPLENBMkZuQjtJQUFELGNBQUM7Q0FBQSxBQTNGRCxDQUE2QixHQUFHLEdBMkYvQjtTQTNGWSxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlcixcclxuICBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXRcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgbmdmLCBkcmFnTWV0YSB9IGZyb20gXCIuL25nZi5kaXJlY3RpdmVcIlxyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6IFwiW25nZkRyb3BdXCIsXHJcbiAgZXhwb3J0QXM6IFwibmdmRHJvcFwiXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBuZ2ZEcm9wIGV4dGVuZHMgbmdmIHtcclxuICBAT3V0cHV0KCkgZmlsZU92ZXI6RXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBJbnB1dCgpIHZhbGlkRHJhZzpib29sZWFuID0gZmFsc2VcclxuICBAT3V0cHV0KCkgdmFsaWREcmFnQ2hhbmdlOkV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoKSBpbnZhbGlkRHJhZyA9IGZhbHNlXHJcbiAgQE91dHB1dCgpIGludmFsaWREcmFnQ2hhbmdlOkV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoKSBkcmFnRmlsZXMgITogZHJhZ01ldGFbXVxyXG4gIEBPdXRwdXQoKSBkcmFnRmlsZXNDaGFuZ2U6RXZlbnRFbWl0dGVyPGRyYWdNZXRhW10+ID0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxyXG4gIG9uRHJvcChldmVudDpFdmVudCk6dm9pZCB7XHJcbiAgICBpZih0aGlzLmZpbGVEcm9wRGlzYWJsZWQpe1xyXG4gICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2xvc2VEcmFncygpXHJcbiAgICBsZXQgZmlsZXMgPSB0aGlzLmV2ZW50VG9GaWxlcyhldmVudClcclxuXHJcbiAgICBpZighZmlsZXMubGVuZ3RoKXJldHVyblxyXG5cclxuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgIHRoaXMuaGFuZGxlRmlsZXMoZmlsZXMpXHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlcyhmaWxlczpGaWxlW10pe1xyXG4gICAgdGhpcy5maWxlT3Zlci5lbWl0KGZhbHNlKS8vdHVybi1vZmYgZHJhZ292ZXJcclxuICAgIHN1cGVyLmhhbmRsZUZpbGVzKGZpbGVzKVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKVxyXG4gIG9uRHJhZ092ZXIoZXZlbnQ6RXZlbnQpOnZvaWQge1xyXG4gICAgaWYodGhpcy5maWxlRHJvcERpc2FibGVkKXtcclxuICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmFuc2ZlciA9IHRoaXMuZXZlbnRUb1RyYW5zZmVyKGV2ZW50KVxyXG5cclxuICAgIGxldCBmaWxlcyA9IHRoaXMuZXZlbnRUb0ZpbGVzKGV2ZW50KVxyXG5cclxuICAgIGxldCBqc29uRmlsZXMgPSB0aGlzLmZpbGVzVG9Xcml0ZWFibGVPYmplY3QoZmlsZXMpXHJcbiAgICB0aGlzLmRyYWdGaWxlc0NoYW5nZS5lbWl0KCB0aGlzLmRyYWdGaWxlcz1qc29uRmlsZXMgKVxyXG5cclxuICAgIGlmKCBmaWxlcy5sZW5ndGggKXtcclxuICAgICAgdGhpcy52YWxpZERyYWcgPSB0aGlzLmlzRmlsZXNWYWxpZChmaWxlcylcclxuICAgIH1lbHNle1xyXG4gICAgICAvL1NhZmFyaSwgSUUxMSAmIHNvbWUgYnJvd3NlcnMgZG8gTk9UIHRlbGwgeW91IGFib3V0IGRyYWdnZWQgZmlsZXMgdW50aWwgZHJvcHBlZC4gQWx3YXlzIGNvbnNpZGVyIGEgdmFsaWQgZHJhZ1xyXG4gICAgICB0aGlzLnZhbGlkRHJhZyA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZhbGlkRHJhZ0NoYW5nZS5lbWl0KHRoaXMudmFsaWREcmFnKVxyXG5cclxuICAgIHRoaXMuaW52YWxpZERyYWcgPSAhdGhpcy52YWxpZERyYWdcclxuICAgIHRoaXMuaW52YWxpZERyYWdDaGFuZ2UuZW1pdCh0aGlzLmludmFsaWREcmFnKVxyXG5cclxuICAgIHRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weScvL2NoYW5nZSBjdXJzb3IgYW5kIHN1Y2hcclxuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KVxyXG4gICAgdGhpcy5maWxlT3Zlci5lbWl0KHRydWUpXHJcbiAgfVxyXG5cclxuICBjbG9zZURyYWdzKCl7XHJcbiAgICBkZWxldGUgdGhpcy52YWxpZERyYWdcclxuICAgIHRoaXMudmFsaWREcmFnQ2hhbmdlLmVtaXQodGhpcy52YWxpZERyYWcpXHJcbiAgICB0aGlzLmludmFsaWREcmFnID0gZmFsc2VcclxuICAgIHRoaXMuaW52YWxpZERyYWdDaGFuZ2UuZW1pdCh0aGlzLmludmFsaWREcmFnKVxyXG4gICAgZGVsZXRlIHRoaXMuZHJhZ0ZpbGVzXHJcbiAgICB0aGlzLmRyYWdGaWxlc0NoYW5nZS5lbWl0KCB0aGlzLmRyYWdGaWxlcyApXHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKVxyXG4gIG9uRHJhZ0xlYXZlKGV2ZW50OkV2ZW50KTphbnkge1xyXG4gICAgaWYodGhpcy5maWxlRHJvcERpc2FibGVkKXtcclxuICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5jbG9zZURyYWdzKClcclxuXHJcbiAgICBpZiAoKHRoaXMgYXMgYW55KS5lbGVtZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0ID09PSAodGhpcyBhcyBhbnkpLmVsZW1lbnRbMF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XHJcbiAgICB0aGlzLmZpbGVPdmVyLmVtaXQoZmFsc2UpO1xyXG4gIH1cclxufSJdfQ==