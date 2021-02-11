import { __decorate } from "tslib";
import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ngf } from "./ngf.directive";
let ngfDrop = class ngfDrop extends ngf {
    constructor() {
        super(...arguments);
        this.fileOver = new EventEmitter();
        this.validDrag = false;
        this.validDragChange = new EventEmitter();
        this.invalidDrag = false;
        this.invalidDragChange = new EventEmitter();
        this.dragFilesChange = new EventEmitter();
    }
    onDrop(event) {
        if (this.fileDropDisabled) {
            this.stopEvent(event);
            return;
        }
        this.closeDrags();
        let files = this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    }
    handleFiles(files) {
        this.fileOver.emit(false); //turn-off dragover
        super.handleFiles(files);
    }
    onDragOver(event) {
        if (this.fileDropDisabled) {
            this.stopEvent(event);
            return;
        }
        const transfer = this.eventToTransfer(event);
        let files = this.eventToFiles(event);
        let jsonFiles = this.filesToWriteableObject(files);
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
    }
    closeDrags() {
        delete this.validDrag;
        this.validDragChange.emit(this.validDrag);
        this.invalidDrag = false;
        this.invalidDragChange.emit(this.invalidDrag);
        delete this.dragFiles;
        this.dragFilesChange.emit(this.dragFiles);
    }
    onDragLeave(event) {
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
    }
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
export { ngfDrop };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmRHJvcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWZpbGUvIiwic291cmNlcyI6WyJmaWxlLXVwbG9hZC9uZ2ZEcm9wLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxZQUFZLEVBQ3ZCLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUM1QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsR0FBRyxFQUFZLE1BQU0saUJBQWlCLENBQUE7QUFNL0MsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBUSxTQUFRLEdBQUc7SUFBaEM7O1FBQ1ksYUFBUSxHQUFxQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGNBQVMsR0FBVyxLQUFLLENBQUE7UUFDeEIsb0JBQWUsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUUzRCxnQkFBVyxHQUFHLEtBQUssQ0FBQTtRQUNsQixzQkFBaUIsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUc1RCxvQkFBZSxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFBO0lBaUZ6RSxDQUFDO0lBOUVDLE1BQU0sQ0FBQyxLQUFXO1FBQ2hCLElBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsT0FBTTtTQUNQO1FBRUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ2pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFcEMsSUFBRyxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQUMsT0FBTTtRQUV2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDekIsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFZO1FBQ3RCLElBQUks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REFBOEQ7QUFHdkU7SUFEQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7cUNBY2hDO0FBUUQ7SUFEQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7eUNBNkJwQztBQVlEO0lBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzBDQWlCckM7QUExRlUsT0FBTztJQUpuQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsV0FBVztRQUNyQixRQUFRLEVBQUUsU0FBUztLQUNwQixDQUFDO0dBQ1csT0FBTyxDQTJGbkI7U0EzRlksT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IG5nZiwgZHJhZ01ldGEgfSBmcm9tIFwiLi9uZ2YuZGlyZWN0aXZlXCJcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiBcIltuZ2ZEcm9wXVwiLFxyXG4gIGV4cG9ydEFzOiBcIm5nZkRyb3BcIlxyXG59KVxyXG5leHBvcnQgY2xhc3MgbmdmRHJvcCBleHRlbmRzIG5nZiB7XHJcbiAgQE91dHB1dCgpIGZpbGVPdmVyOkV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBASW5wdXQoKSB2YWxpZERyYWc6Ym9vbGVhbiA9IGZhbHNlXHJcbiAgQE91dHB1dCgpIHZhbGlkRHJhZ0NoYW5nZTpFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KCkgaW52YWxpZERyYWcgPSBmYWxzZVxyXG4gIEBPdXRwdXQoKSBpbnZhbGlkRHJhZ0NoYW5nZTpFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KCkgZHJhZ0ZpbGVzICE6IGRyYWdNZXRhW11cclxuICBAT3V0cHV0KCkgZHJhZ0ZpbGVzQ2hhbmdlOkV2ZW50RW1pdHRlcjxkcmFnTWV0YVtdPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcclxuICBvbkRyb3AoZXZlbnQ6RXZlbnQpOnZvaWQge1xyXG4gICAgaWYodGhpcy5maWxlRHJvcERpc2FibGVkKXtcclxuICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNsb3NlRHJhZ3MoKVxyXG4gICAgbGV0IGZpbGVzID0gdGhpcy5ldmVudFRvRmlsZXMoZXZlbnQpXHJcblxyXG4gICAgaWYoIWZpbGVzLmxlbmd0aClyZXR1cm5cclxuXHJcbiAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XHJcbiAgICB0aGlzLmhhbmRsZUZpbGVzKGZpbGVzKVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsZXMoZmlsZXM6RmlsZVtdKXtcclxuICAgIHRoaXMuZmlsZU92ZXIuZW1pdChmYWxzZSkvL3R1cm4tb2ZmIGRyYWdvdmVyXHJcbiAgICBzdXBlci5oYW5kbGVGaWxlcyhmaWxlcylcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcclxuICBvbkRyYWdPdmVyKGV2ZW50OkV2ZW50KTp2b2lkIHtcclxuICAgIGlmKHRoaXMuZmlsZURyb3BEaXNhYmxlZCl7XHJcbiAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJhbnNmZXIgPSB0aGlzLmV2ZW50VG9UcmFuc2ZlcihldmVudClcclxuXHJcbiAgICBsZXQgZmlsZXMgPSB0aGlzLmV2ZW50VG9GaWxlcyhldmVudClcclxuXHJcbiAgICBsZXQganNvbkZpbGVzID0gdGhpcy5maWxlc1RvV3JpdGVhYmxlT2JqZWN0KGZpbGVzKVxyXG4gICAgdGhpcy5kcmFnRmlsZXNDaGFuZ2UuZW1pdCggdGhpcy5kcmFnRmlsZXM9anNvbkZpbGVzIClcclxuXHJcbiAgICBpZiggZmlsZXMubGVuZ3RoICl7XHJcbiAgICAgIHRoaXMudmFsaWREcmFnID0gdGhpcy5pc0ZpbGVzVmFsaWQoZmlsZXMpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgLy9TYWZhcmksIElFMTEgJiBzb21lIGJyb3dzZXJzIGRvIE5PVCB0ZWxsIHlvdSBhYm91dCBkcmFnZ2VkIGZpbGVzIHVudGlsIGRyb3BwZWQuIEFsd2F5cyBjb25zaWRlciBhIHZhbGlkIGRyYWdcclxuICAgICAgdGhpcy52YWxpZERyYWcgPSB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YWxpZERyYWdDaGFuZ2UuZW1pdCh0aGlzLnZhbGlkRHJhZylcclxuXHJcbiAgICB0aGlzLmludmFsaWREcmFnID0gIXRoaXMudmFsaWREcmFnXHJcbiAgICB0aGlzLmludmFsaWREcmFnQ2hhbmdlLmVtaXQodGhpcy5pbnZhbGlkRHJhZylcclxuXHJcbiAgICB0cmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknLy9jaGFuZ2UgY3Vyc29yIGFuZCBzdWNoXHJcbiAgICB0aGlzLnN0b3BFdmVudChldmVudClcclxuICAgIHRoaXMuZmlsZU92ZXIuZW1pdCh0cnVlKVxyXG4gIH1cclxuXHJcbiAgY2xvc2VEcmFncygpe1xyXG4gICAgZGVsZXRlIHRoaXMudmFsaWREcmFnXHJcbiAgICB0aGlzLnZhbGlkRHJhZ0NoYW5nZS5lbWl0KHRoaXMudmFsaWREcmFnKVxyXG4gICAgdGhpcy5pbnZhbGlkRHJhZyA9IGZhbHNlXHJcbiAgICB0aGlzLmludmFsaWREcmFnQ2hhbmdlLmVtaXQodGhpcy5pbnZhbGlkRHJhZylcclxuICAgIGRlbGV0ZSB0aGlzLmRyYWdGaWxlc1xyXG4gICAgdGhpcy5kcmFnRmlsZXNDaGFuZ2UuZW1pdCggdGhpcy5kcmFnRmlsZXMgKVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSlcclxuICBvbkRyYWdMZWF2ZShldmVudDpFdmVudCk6YW55IHtcclxuICAgIGlmKHRoaXMuZmlsZURyb3BEaXNhYmxlZCl7XHJcbiAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuY2xvc2VEcmFncygpXHJcblxyXG4gICAgaWYgKCh0aGlzIGFzIGFueSkuZWxlbWVudCkge1xyXG4gICAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldCA9PT0gKHRoaXMgYXMgYW55KS5lbGVtZW50WzBdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xyXG4gICAgdGhpcy5maWxlT3Zlci5lbWl0KGZhbHNlKTtcclxuICB9XHJcbn0iXX0=