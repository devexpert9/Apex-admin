import { __decorate } from "tslib";
import { Directive, EventEmitter, Output, Input } from '@angular/core';
let ngfUploadStatus = class ngfUploadStatus {
    constructor() {
        this.percent = 0;
        this.percentChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes.httpEvent && changes.httpEvent.currentValue) {
            const event = changes.httpEvent.currentValue;
            if (event.loaded && event.total) {
                setTimeout(() => {
                    this.percent = Math.round(100 * event.loaded / event.total);
                    this.percentChange.emit(this.percent);
                }, 0);
            }
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
export { ngfUploadStatus };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmVXBsb2FkU3RhdHVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZlVwbG9hZFN0YXR1cy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdkUsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZTtJQUE1QjtRQUNXLFlBQU8sR0FBVSxDQUFDLENBQUE7UUFDakIsa0JBQWEsR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQTtJQWNuRSxDQUFDO0lBWEMsV0FBVyxDQUFFLE9BQU87UUFDbEIsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFO1lBQ3ZELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFBO1lBQzVDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUMvQixVQUFVLENBQUMsR0FBRSxFQUFFO29CQUNiLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQTtnQkFDekMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQ047U0FDRjtJQUNILENBQUM7Q0FDRixDQUFBO0FBZlU7SUFBUixLQUFLLEVBQUU7Z0RBQW1CO0FBQ2pCO0lBQVQsTUFBTSxFQUFFO3NEQUF3RDtBQUN4RDtJQUFSLEtBQUssRUFBRTtrREFBbUI7QUFIaEIsZUFBZTtJQUQzQixTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztHQUM1QixlQUFlLENBZ0IzQjtTQWhCWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ2ZVcGxvYWRTdGF0dXMnfSlcbmV4cG9ydCBjbGFzcyBuZ2ZVcGxvYWRTdGF0dXMge1xuICBASW5wdXQoKSBwZXJjZW50Om51bWJlciA9IDBcbiAgQE91dHB1dCgpIHBlcmNlbnRDaGFuZ2U6RXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQElucHV0KCkgaHR0cEV2ZW50ICE6IEV2ZW50XG5cbiAgbmdPbkNoYW5nZXMoIGNoYW5nZXMgKXtcbiAgICBpZiggY2hhbmdlcy5odHRwRXZlbnQgJiYgY2hhbmdlcy5odHRwRXZlbnQuY3VycmVudFZhbHVlICl7XG4gICAgICBjb25zdCBldmVudCA9IGNoYW5nZXMuaHR0cEV2ZW50LmN1cnJlbnRWYWx1ZVxuICAgICAgaWYgKGV2ZW50LmxvYWRlZCAmJiBldmVudC50b3RhbCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgdGhpcy5wZXJjZW50ID0gTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCk7XG4gICAgICAgICAgdGhpcy5wZXJjZW50Q2hhbmdlLmVtaXQoIHRoaXMucGVyY2VudCApXG4gICAgICAgIH0sIDApXG4gICAgICB9XG4gICAgfVxuICB9XG59Il19