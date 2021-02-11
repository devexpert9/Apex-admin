import { __decorate } from "tslib";
import { IterableDiffer, IterableDiffers, Directive, EventEmitter, Output, Input } from '@angular/core';
let ngfFormData = class ngfFormData {
    constructor(IterableDiffers) {
        this.postName = "file";
        this.FormData = new FormData();
        this.FormDataChange = new EventEmitter();
        this.differ = IterableDiffers.find([]).create();
    }
    ngDoCheck() {
        var changes = this.differ.diff(this.files);
        if (changes) {
            setTimeout(() => this.buildFormData(), 0);
        }
    }
    buildFormData() {
        const isArray = typeof (this.files) === 'object' && this.files.constructor === Array;
        if (isArray) {
            this.FormData = new FormData();
            const files = this.files || [];
            files.forEach(file => this.FormData.append(this.postName, file, this.fileName || file.name));
            this.FormDataChange.emit(this.FormData);
        }
        else {
            delete this.FormData;
        }
    }
};
ngfFormData.ctorParameters = () => [
    { type: IterableDiffers }
];
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
export { ngfFormData };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmRm9ybURhdGEuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1maWxlLyIsInNvdXJjZXMiOlsiZmlsZS11cGxvYWQvbmdmRm9ybURhdGEuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixTQUFTLEVBQUUsWUFBWSxFQUN2QixNQUFNLEVBQUUsS0FBSyxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7SUFVdEIsWUFBWSxlQUFnQztRQVJuQyxhQUFRLEdBQVUsTUFBTSxDQUFBO1FBR3hCLGFBQVEsR0FBWSxJQUFJLFFBQVEsRUFBRSxDQUFBO1FBQ2pDLG1CQUFjLEdBQTBCLElBQUksWUFBWSxFQUFFLENBQUE7UUFLbEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ2pELENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBRTdDLElBQUksT0FBTyxFQUFFO1lBQ1gsVUFBVSxDQUFDLEdBQUUsRUFBRSxDQUFBLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUN4QztJQUNILENBQUM7SUFFRCxhQUFhO1FBQ1gsTUFBTSxPQUFPLEdBQUcsT0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBRyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUcsS0FBSyxDQUFBO1FBRS9FLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFBO1lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFBO1lBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFBLEVBQUUsQ0FDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3BFLENBQUE7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUE7U0FDMUM7YUFBSTtZQUNILE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtTQUNyQjtJQUNILENBQUM7Q0FDRixDQUFBOztZQTFCOEIsZUFBZTs7QUFUbkM7SUFBUixLQUFLLEVBQUU7MENBQWdCO0FBQ2Y7SUFBUixLQUFLLEVBQUU7NkNBQXlCO0FBQ3hCO0lBQVIsS0FBSyxFQUFFOzZDQUFtQjtBQUVsQjtJQUFSLEtBQUssRUFBRTs2Q0FBbUM7QUFDakM7SUFBVCxNQUFNLEVBQUU7bURBQTJEO0FBTnpELFdBQVc7SUFEdkIsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBQyxDQUFDO0dBQ3hCLFdBQVcsQ0FvQ3ZCO1NBcENZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJdGVyYWJsZURpZmZlcixcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LCBJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ2ZGb3JtRGF0YSd9KVxuZXhwb3J0IGNsYXNzIG5nZkZvcm1EYXRhIHtcbiAgQElucHV0KCkgZmlsZXMgITogRmlsZVtdXG4gIEBJbnB1dCgpIHBvc3ROYW1lOnN0cmluZyA9IFwiZmlsZVwiXG4gIEBJbnB1dCgpIGZpbGVOYW1lICE6IHN0cmluZy8vZm9yY2UgZmlsZSBuYW1lXG5cbiAgQElucHV0KCkgRm9ybURhdGE6Rm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICBAT3V0cHV0KCkgRm9ybURhdGFDaGFuZ2U6RXZlbnRFbWl0dGVyPEZvcm1EYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIGRpZmZlcjpJdGVyYWJsZURpZmZlcjx7fT5cblxuICBjb25zdHJ1Y3RvcihJdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyl7XG4gICAgdGhpcy5kaWZmZXIgPSBJdGVyYWJsZURpZmZlcnMuZmluZChbXSkuY3JlYXRlKClcbiAgfVxuXG4gIG5nRG9DaGVjaygpe1xuICAgIHZhciBjaGFuZ2VzID0gdGhpcy5kaWZmZXIuZGlmZiggdGhpcy5maWxlcyApO1xuXG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHNldFRpbWVvdXQoKCk9PnRoaXMuYnVpbGRGb3JtRGF0YSgpLCAwKVxuICAgIH1cbiAgfVxuXG4gIGJ1aWxkRm9ybURhdGEoKXtcbiAgICBjb25zdCBpc0FycmF5ID0gdHlwZW9mKHRoaXMuZmlsZXMpPT09J29iamVjdCcgJiYgdGhpcy5maWxlcy5jb25zdHJ1Y3Rvcj09PUFycmF5XG5cbiAgICBpZiggaXNBcnJheSApe1xuICAgICAgdGhpcy5Gb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgICBjb25zdCBmaWxlcyA9IHRoaXMuZmlsZXMgfHwgW11cbiAgICAgIGZpbGVzLmZvckVhY2goZmlsZT0+XG4gICAgICAgIHRoaXMuRm9ybURhdGEuYXBwZW5kKHRoaXMucG9zdE5hbWUsIGZpbGUsIHRoaXMuZmlsZU5hbWV8fGZpbGUubmFtZSlcbiAgICAgIClcbiAgICAgIHRoaXMuRm9ybURhdGFDaGFuZ2UuZW1pdCggdGhpcy5Gb3JtRGF0YSApXG4gICAgfWVsc2V7XG4gICAgICBkZWxldGUgdGhpcy5Gb3JtRGF0YVxuICAgIH1cbiAgfVxufSJdfQ==