import { __decorate } from "tslib";
import { Directive, EventEmitter, ElementRef, Input, Output, HostListener } from '@angular/core';
import { createInvisibleFileInputWrap, isFileInput, detectSwipe } from "./doc-event-help.functions";
import { acceptType, applyExifRotation, dataUrl } from "./fileTools";
/** A master base set of logic intended to support file select/drag/drop operations
 NOTE: Use ngfDrop for full drag/drop. Use ngfSelect for selecting
*/
var ngf = /** @class */ (function () {
    function ngf(element) {
        this.element = element;
        this.filters = [];
        this.lastFileCount = 0;
        //@Input() forceFilename:string
        //@Input() forcePostname:string
        this.ngfFixOrientation = true;
        this.fileDropDisabled = false;
        this.selectable = false;
        this.directiveInit = new EventEmitter();
        this.lastInvalids = [];
        this.lastInvalidsChange = new EventEmitter();
        this.lastBaseUrlChange = new EventEmitter();
        this.fileChange = new EventEmitter();
        this.files = [];
        this.filesChange = new EventEmitter();
        this.initFilters();
    }
    ngf.prototype.initFilters = function () {
        // the order is important
        this.filters.push({ name: 'accept', fn: this._acceptFilter });
        this.filters.push({ name: 'fileSize', fn: this._fileSizeFilter });
        //this.filters.push({name: 'fileType', fn: this._fileTypeFilter})
        //this.filters.push({name: 'queueLimit', fn: this._queueLimitFilter})
        //this.filters.push({name: 'mimeType', fn: this._mimeTypeFilter})
    };
    ngf.prototype.ngOnDestroy = function () {
        delete this.fileElm; //faster memory release of dom element
    };
    ngf.prototype.ngOnInit = function () {
        var _this = this;
        if (this.selectable) {
            this.enableSelecting();
        }
        if (this.multiple) {
            this.paramFileElm().setAttribute('multiple', this.multiple);
        }
        //create reference to this class with one cycle delay to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(function () {
            _this.directiveInit.emit(_this);
        }, 0);
    };
    ngf.prototype.ngOnChanges = function (changes) {
        if (changes.accept) {
            this.paramFileElm().setAttribute('accept', changes.accept.currentValue || '*');
        }
    };
    ngf.prototype.paramFileElm = function () {
        if (this.fileElm)
            return this.fileElm; //already defined
        //elm is a file input
        var isFile = isFileInput(this.element.nativeElement);
        if (isFile)
            return this.fileElm = this.element.nativeElement;
        //create foo file input
        var label = createInvisibleFileInputWrap();
        this.fileElm = label.getElementsByTagName('input')[0];
        this.fileElm.addEventListener('change', this.changeFn.bind(this));
        this.element.nativeElement.appendChild(label);
        return this.fileElm;
    };
    ngf.prototype.enableSelecting = function () {
        var _this = this;
        var elm = this.element.nativeElement;
        if (isFileInput(elm)) {
            var bindedHandler_1 = function (_ev) { return _this.beforeSelect(); };
            elm.addEventListener('click', bindedHandler_1);
            elm.addEventListener('touchstart', bindedHandler_1);
            return;
        }
        var bindedHandler = function (ev) { return _this.clickHandler(ev); };
        elm.addEventListener('click', bindedHandler);
        elm.addEventListener('touchstart', bindedHandler);
        elm.addEventListener('touchend', bindedHandler);
    };
    ngf.prototype.getValidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            if (this.isFileValid(files[x])) {
                rtn.push(files[x]);
            }
        }
        return rtn;
    };
    ngf.prototype.getInvalidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            var failReason = this.getFileFilterFailName(files[x]);
            if (failReason) {
                rtn.push({
                    file: files[x],
                    type: failReason
                });
            }
        }
        return rtn;
    };
    ngf.prototype.handleFiles = function (files) {
        var _this = this;
        var valids = this.getValidFiles(files);
        if (files.length != valids.length) {
            this.lastInvalids = this.getInvalidFiles(files);
        }
        else {
            delete this.lastInvalids;
        }
        this.lastInvalidsChange.emit(this.lastInvalids);
        if (valids.length) {
            if (this.ngfFixOrientation) {
                this.applyExifRotations(valids)
                    .then(function (fixedFiles) { return _this.que(fixedFiles); });
            }
            else {
                this.que(valids);
            }
        }
        if (this.isEmptyAfterSelection()) {
            this.element.nativeElement.value = '';
        }
    };
    ngf.prototype.que = function (files) {
        var _this = this;
        this.files = this.files || [];
        Array.prototype.push.apply(this.files, files);
        //below break memory ref and doesnt act like a que
        //this.files = files//causes memory change which triggers bindings like <ngfFormData [files]="files"></ngfFormData>
        this.filesChange.emit(this.files);
        if (files.length) {
            this.fileChange.emit(this.file = files[0]);
            if (this.lastBaseUrlChange.observers.length) {
                dataUrl(files[0])
                    .then(function (url) { return _this.lastBaseUrlChange.emit(url); });
            }
        }
        //will be checked for input value clearing
        this.lastFileCount = this.files.length;
    };
    /** called when input has files */
    ngf.prototype.changeFn = function (event) {
        var fileList = event.__files_ || (event.target && event.target.files);
        if (!fileList)
            return;
        this.stopEvent(event);
        this.handleFiles(fileList);
    };
    ngf.prototype.clickHandler = function (evt) {
        var elm = this.element.nativeElement;
        if (elm.getAttribute('disabled') || this.fileDropDisabled) {
            return false;
        }
        var r = detectSwipe(evt);
        // prevent the click if it is a swipe
        if (r !== false)
            return r;
        var fileElm = this.paramFileElm();
        fileElm.click();
        //fileElm.dispatchEvent( new Event('click') );
        this.beforeSelect();
        return false;
    };
    ngf.prototype.beforeSelect = function () {
        if (this.files && this.lastFileCount === this.files.length)
            return;
        //if no files in array, be sure browser doesnt prevent reselect of same file (see github issue 27)
        this.fileElm.value = null;
    };
    ngf.prototype.isEmptyAfterSelection = function () {
        return !!this.element.nativeElement.attributes.multiple;
    };
    ngf.prototype.eventToTransfer = function (event) {
        if (event.dataTransfer)
            return event.dataTransfer;
        return event.originalEvent ? event.originalEvent.dataTransfer : null;
    };
    ngf.prototype.stopEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    ngf.prototype.transferHasFiles = function (transfer) {
        if (!transfer.types) {
            return false;
        }
        if (transfer.types.indexOf) {
            return transfer.types.indexOf('Files') !== -1;
        }
        else if (transfer.types.contains) {
            return transfer.types.contains('Files');
        }
        else {
            return false;
        }
    };
    ngf.prototype.eventToFiles = function (event) {
        var transfer = this.eventToTransfer(event);
        if (transfer) {
            if (transfer.files && transfer.files.length) {
                return transfer.files;
            }
            if (transfer.items && transfer.items.length) {
                return transfer.items;
            }
        }
        return [];
    };
    ngf.prototype.applyExifRotations = function (files) {
        var mapper = function (file, index) {
            return applyExifRotation(file)
                .then(function (fixedFile) { return files.splice(index, 1, fixedFile); });
        };
        var proms = [];
        for (var x = files.length - 1; x >= 0; --x) {
            proms[x] = mapper(files[x], x);
        }
        return Promise.all(proms).then(function () { return files; });
    };
    ngf.prototype.onChange = function (event) {
        var files = this.element.nativeElement.files || this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    };
    ngf.prototype.getFileFilterFailName = function (file) {
        for (var i = 0; i < this.filters.length; i++) {
            if (!this.filters[i].fn.call(this, file)) {
                return this.filters[i].name;
            }
        }
        return undefined;
    };
    ngf.prototype.isFileValid = function (file) {
        var noFilters = !this.accept && (!this.filters || !this.filters.length);
        if (noFilters) {
            return true; //we have no filters so all files are valid
        }
        return this.getFileFilterFailName(file) ? false : true;
    };
    ngf.prototype.isFilesValid = function (files) {
        for (var x = files.length - 1; x >= 0; --x) {
            if (!this.isFileValid(files[x])) {
                return false;
            }
        }
        return true;
    };
    ngf.prototype._acceptFilter = function (item) {
        return acceptType(this.accept, item.type, item.name);
    };
    ngf.prototype._fileSizeFilter = function (item) {
        return !(this.maxSize && item.size > this.maxSize);
    };
    /** browsers try hard to conceal data about file drags, this tends to undo that */
    ngf.prototype.filesToWriteableObject = function (files) {
        var jsonFiles = [];
        for (var x = 0; x < files.length; ++x) {
            jsonFiles.push({
                type: files[x].type,
                kind: files[x]["kind"]
            });
        }
        return jsonFiles;
    };
    ngf.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], ngf.prototype, "multiple", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "accept", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "maxSize", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "ngfFixOrientation", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "fileDropDisabled", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "selectable", void 0);
    __decorate([
        Output('init')
    ], ngf.prototype, "directiveInit", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "lastInvalids", void 0);
    __decorate([
        Output()
    ], ngf.prototype, "lastInvalidsChange", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "lastBaseUrl", void 0);
    __decorate([
        Output()
    ], ngf.prototype, "lastBaseUrlChange", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "file", void 0);
    __decorate([
        Output()
    ], ngf.prototype, "fileChange", void 0);
    __decorate([
        Input()
    ], ngf.prototype, "files", void 0);
    __decorate([
        Output()
    ], ngf.prototype, "filesChange", void 0);
    __decorate([
        HostListener('change', ['$event'])
    ], ngf.prototype, "onChange", null);
    ngf = __decorate([
        Directive({
            selector: "[ngf]",
            exportAs: "ngf"
        })
    ], ngf);
    return ngf;
}());
export { ngf };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBQ25HLE9BQU8sRUFDTCxVQUFVLEVBQ1YsaUJBQWlCLEVBQUUsT0FBTyxFQUMzQixNQUFNLGFBQWEsQ0FBQTtBQU9wQjs7RUFFRTtBQUtGO0lBNEJFLGFBQW1CLE9BQWtCO1FBQWxCLFlBQU8sR0FBUCxPQUFPLENBQVc7UUExQnJDLFlBQU8sR0FBNEMsRUFBRSxDQUFBO1FBQ3JELGtCQUFhLEdBQVEsQ0FBQyxDQUFBO1FBS3RCLCtCQUErQjtRQUMvQiwrQkFBK0I7UUFDdEIsc0JBQWlCLEdBQVcsSUFBSSxDQUFBO1FBRWhDLHFCQUFnQixHQUFXLEtBQUssQ0FBQTtRQUNoQyxlQUFVLEdBQVcsS0FBSyxDQUFBO1FBQ25CLGtCQUFhLEdBQXFCLElBQUksWUFBWSxFQUFFLENBQUE7UUFFM0QsaUJBQVksR0FBcUIsRUFBRSxDQUFBO1FBQ2xDLHVCQUFrQixHQUEyQyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBRy9FLHNCQUFpQixHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFBO1FBRzNELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUVuRCxVQUFLLEdBQVUsRUFBRSxDQUFBO1FBQ2hCLGdCQUFXLEdBQXdCLElBQUksWUFBWSxFQUFVLENBQUM7UUFHdEUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ3BCLENBQUM7SUFFRCx5QkFBVyxHQUFYO1FBQ0UseUJBQXlCO1FB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QUFDLENBQUE7U0FDSDtRQUNELE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUM7O2dCQW5TMEIsVUFBVTs7SUF2QjVCO1FBQVIsS0FBSyxFQUFFO3lDQUFrQjtJQUNqQjtRQUFSLEtBQUssRUFBRTt1Q0FBa0I7SUFDakI7UUFBUixLQUFLLEVBQUU7d0NBQWtCO0lBR2pCO1FBQVIsS0FBSyxFQUFFO2tEQUFpQztJQUVoQztRQUFSLEtBQUssRUFBRTtpREFBaUM7SUFDaEM7UUFBUixLQUFLLEVBQUU7MkNBQTJCO0lBQ25CO1FBQWYsTUFBTSxDQUFDLE1BQU0sQ0FBQzs4Q0FBcUQ7SUFFM0Q7UUFBUixLQUFLLEVBQUU7NkNBQW9DO0lBQ2xDO1FBQVQsTUFBTSxFQUFFO21EQUFnRjtJQUVoRjtRQUFSLEtBQUssRUFBRTs0Q0FBc0I7SUFDcEI7UUFBVCxNQUFNLEVBQUU7a0RBQTREO0lBRTVEO1FBQVIsS0FBSyxFQUFFO3FDQUFhO0lBQ1g7UUFBVCxNQUFNLEVBQUU7MkNBQW1EO0lBRW5EO1FBQVIsS0FBSyxFQUFFO3NDQUFrQjtJQUNoQjtRQUFULE1BQU0sRUFBRTs0Q0FBK0Q7SUE2T3hFO1FBREMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3VDQVFsQztJQTlRVSxHQUFHO1FBSmYsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE9BQU87WUFDakIsUUFBUSxFQUFDLEtBQUs7U0FDZixDQUFDO09BQ1csR0FBRyxDQWdVZjtJQUFELFVBQUM7Q0FBQSxBQWhVRCxJQWdVQztTQWhVWSxHQUFHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYsIElucHV0LCBPdXRwdXQsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjcmVhdGVJbnZpc2libGVGaWxlSW5wdXRXcmFwLCBpc0ZpbGVJbnB1dCwgZGV0ZWN0U3dpcGUgfSBmcm9tIFwiLi9kb2MtZXZlbnQtaGVscC5mdW5jdGlvbnNcIlxyXG5pbXBvcnQge1xyXG4gIGFjY2VwdFR5cGUsIEludmFsaWRGaWxlSXRlbSxcclxuICBhcHBseUV4aWZSb3RhdGlvbiwgZGF0YVVybFxyXG59IGZyb20gXCIuL2ZpbGVUb29sc1wiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIGRyYWdNZXRhe1xyXG4gIHR5cGU6c3RyaW5nXHJcbiAga2luZDpzdHJpbmdcclxufVxyXG5cclxuLyoqIEEgbWFzdGVyIGJhc2Ugc2V0IG9mIGxvZ2ljIGludGVuZGVkIHRvIHN1cHBvcnQgZmlsZSBzZWxlY3QvZHJhZy9kcm9wIG9wZXJhdGlvbnNcclxuIE5PVEU6IFVzZSBuZ2ZEcm9wIGZvciBmdWxsIGRyYWcvZHJvcC4gVXNlIG5nZlNlbGVjdCBmb3Igc2VsZWN0aW5nXHJcbiovXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiBcIltuZ2ZdXCIsXHJcbiAgZXhwb3J0QXM6XCJuZ2ZcIlxyXG59KVxyXG5leHBvcnQgY2xhc3MgbmdmIHtcclxuICBmaWxlRWxtOmFueVxyXG4gIGZpbHRlcnM6e25hbWU6c3RyaW5nLCBmbjooZmlsZTpGaWxlKT0+Ym9vbGVhbn1bXSA9IFtdXHJcbiAgbGFzdEZpbGVDb3VudDpudW1iZXI9MFxyXG5cclxuICBASW5wdXQoKSBtdWx0aXBsZSAhOnN0cmluZ1xyXG4gIEBJbnB1dCgpIGFjY2VwdCAgICE6c3RyaW5nXHJcbiAgQElucHV0KCkgbWF4U2l6ZSAgITpudW1iZXJcclxuICAvL0BJbnB1dCgpIGZvcmNlRmlsZW5hbWU6c3RyaW5nXHJcbiAgLy9ASW5wdXQoKSBmb3JjZVBvc3RuYW1lOnN0cmluZ1xyXG4gIEBJbnB1dCgpIG5nZkZpeE9yaWVudGF0aW9uOmJvb2xlYW4gPSB0cnVlXHJcblxyXG4gIEBJbnB1dCgpIGZpbGVEcm9wRGlzYWJsZWQ6Ym9vbGVhbiA9IGZhbHNlXHJcbiAgQElucHV0KCkgc2VsZWN0YWJsZTpib29sZWFuID0gZmFsc2VcclxuICBAT3V0cHV0KCdpbml0JykgZGlyZWN0aXZlSW5pdDpFdmVudEVtaXR0ZXI8bmdmPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG4gIFxyXG4gIEBJbnB1dCgpIGxhc3RJbnZhbGlkczpJbnZhbGlkRmlsZUl0ZW1bXSA9IFtdXHJcbiAgQE91dHB1dCgpIGxhc3RJbnZhbGlkc0NoYW5nZTpFdmVudEVtaXR0ZXI8e2ZpbGU6RmlsZSx0eXBlOnN0cmluZ31bXT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KCkgbGFzdEJhc2VVcmwgITogc3RyaW5nLy9iYXNlNjQgbGFzdCBmaWxlIHVwbG9hZGVkIHVybFxyXG4gIEBPdXRwdXQoKSBsYXN0QmFzZVVybENoYW5nZTpFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG4gIFxyXG4gIEBJbnB1dCgpIGZpbGUgITogRmlsZS8vbGFzdCBmaWxlIHVwbG9hZGVkXHJcbiAgQE91dHB1dCgpIGZpbGVDaGFuZ2U6RXZlbnRFbWl0dGVyPEZpbGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBJbnB1dCgpIGZpbGVzOkZpbGVbXSA9IFtdXHJcbiAgQE91dHB1dCgpIGZpbGVzQ2hhbmdlOkV2ZW50RW1pdHRlcjxGaWxlW10+ID0gbmV3IEV2ZW50RW1pdHRlcjxGaWxlW10+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OkVsZW1lbnRSZWYpe1xyXG4gICAgdGhpcy5pbml0RmlsdGVycygpXHJcbiAgfVxyXG5cclxuICBpbml0RmlsdGVycygpe1xyXG4gICAgLy8gdGhlIG9yZGVyIGlzIGltcG9ydGFudFxyXG4gICAgdGhpcy5maWx0ZXJzLnB1c2goe25hbWU6ICdhY2NlcHQnLCBmbjogdGhpcy5fYWNjZXB0RmlsdGVyfSlcclxuICAgIHRoaXMuZmlsdGVycy5wdXNoKHtuYW1lOiAnZmlsZVNpemUnLCBmbjogdGhpcy5fZmlsZVNpemVGaWx0ZXJ9KVxyXG5cclxuICAgIC8vdGhpcy5maWx0ZXJzLnB1c2goe25hbWU6ICdmaWxlVHlwZScsIGZuOiB0aGlzLl9maWxlVHlwZUZpbHRlcn0pXHJcbiAgICAvL3RoaXMuZmlsdGVycy5wdXNoKHtuYW1lOiAncXVldWVMaW1pdCcsIGZuOiB0aGlzLl9xdWV1ZUxpbWl0RmlsdGVyfSlcclxuICAgIC8vdGhpcy5maWx0ZXJzLnB1c2goe25hbWU6ICdtaW1lVHlwZScsIGZuOiB0aGlzLl9taW1lVHlwZUZpbHRlcn0pXHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpe1xyXG4gICAgZGVsZXRlIHRoaXMuZmlsZUVsbS8vZmFzdGVyIG1lbW9yeSByZWxlYXNlIG9mIGRvbSBlbGVtZW50XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpe1xyXG4gICAgaWYoIHRoaXMuc2VsZWN0YWJsZSApe1xyXG4gICAgICB0aGlzLmVuYWJsZVNlbGVjdGluZygpXHJcbiAgICB9XHJcblxyXG4gICAgaWYoIHRoaXMubXVsdGlwbGUgKXtcclxuICAgICAgdGhpcy5wYXJhbUZpbGVFbG0oKS5zZXRBdHRyaWJ1dGUoJ211bHRpcGxlJywgdGhpcy5tdWx0aXBsZSlcclxuICAgIH1cclxuXHJcbiAgICAvL2NyZWF0ZSByZWZlcmVuY2UgdG8gdGhpcyBjbGFzcyB3aXRoIG9uZSBjeWNsZSBkZWxheSB0byBhdm9pZCBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEVycm9yXHJcbiAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgIHRoaXMuZGlyZWN0aXZlSW5pdC5lbWl0KHRoaXMpXHJcbiAgICB9LCAwKVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoIGNoYW5nZXMgKXtcclxuICAgIGlmKCBjaGFuZ2VzLmFjY2VwdCApe1xyXG4gICAgICB0aGlzLnBhcmFtRmlsZUVsbSgpLnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgY2hhbmdlcy5hY2NlcHQuY3VycmVudFZhbHVlIHx8ICcqJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBhcmFtRmlsZUVsbSgpe1xyXG4gICAgaWYoIHRoaXMuZmlsZUVsbSApcmV0dXJuIHRoaXMuZmlsZUVsbS8vYWxyZWFkeSBkZWZpbmVkXHJcbiAgICBcclxuICAgIC8vZWxtIGlzIGEgZmlsZSBpbnB1dFxyXG4gICAgY29uc3QgaXNGaWxlID0gaXNGaWxlSW5wdXQoIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50IClcclxuICAgIGlmKGlzRmlsZSlyZXR1cm4gdGhpcy5maWxlRWxtID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnRcclxuICAgIFxyXG4gICAgLy9jcmVhdGUgZm9vIGZpbGUgaW5wdXRcclxuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlSW52aXNpYmxlRmlsZUlucHV0V3JhcCgpXHJcbiAgICB0aGlzLmZpbGVFbG0gPSBsYWJlbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKVswXVxyXG4gICAgdGhpcy5maWxlRWxtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuY2hhbmdlRm4uYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCggbGFiZWwgKVxyXG4gICAgcmV0dXJuIHRoaXMuZmlsZUVsbVxyXG4gIH1cclxuXHJcbiAgZW5hYmxlU2VsZWN0aW5nKCl7XHJcbiAgICBsZXQgZWxtID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnRcclxuXHJcbiAgICBpZiggaXNGaWxlSW5wdXQoZWxtKSApe1xyXG4gICAgICBjb25zdCBiaW5kZWRIYW5kbGVyID0gX2V2PT50aGlzLmJlZm9yZVNlbGVjdCgpXHJcbiAgICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJpbmRlZEhhbmRsZXIpXHJcbiAgICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgYmluZGVkSGFuZGxlcilcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmluZGVkSGFuZGxlciA9IGV2PT50aGlzLmNsaWNrSGFuZGxlcihldilcclxuICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJpbmRlZEhhbmRsZXIpXHJcbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGJpbmRlZEhhbmRsZXIpXHJcbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBiaW5kZWRIYW5kbGVyKVxyXG4gIH1cclxuXHJcbiAgZ2V0VmFsaWRGaWxlcyggZmlsZXM6RmlsZVtdICk6RmlsZVtde1xyXG4gICAgY29uc3QgcnRuOkZpbGVbXSA9IFtdXHJcbiAgICBmb3IobGV0IHg9ZmlsZXMubGVuZ3RoLTE7IHggPj0gMDsgLS14KXtcclxuICAgICAgaWYoIHRoaXMuaXNGaWxlVmFsaWQoZmlsZXNbeF0pICl7XHJcbiAgICAgICAgcnRuLnB1c2goIGZpbGVzW3hdIClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJ0blxyXG4gIH1cclxuXHJcbiAgZ2V0SW52YWxpZEZpbGVzKGZpbGVzOkZpbGVbXSk6SW52YWxpZEZpbGVJdGVtW117XHJcbiAgICBjb25zdCBydG46SW52YWxpZEZpbGVJdGVtW10gPSBbXVxyXG4gICAgZm9yKGxldCB4PWZpbGVzLmxlbmd0aC0xOyB4ID49IDA7IC0teCl7XHJcbiAgICAgIGxldCBmYWlsUmVhc29uID0gdGhpcy5nZXRGaWxlRmlsdGVyRmFpbE5hbWUoZmlsZXNbeF0pXHJcbiAgICAgIGlmKCBmYWlsUmVhc29uICl7XHJcbiAgICAgICAgcnRuLnB1c2goe1xyXG4gICAgICAgICAgZmlsZSA6IGZpbGVzW3hdLFxyXG4gICAgICAgICAgdHlwZSA6IGZhaWxSZWFzb25cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcnRuXHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlcyhmaWxlczpGaWxlW10pe1xyXG4gICAgY29uc3QgdmFsaWRzID0gdGhpcy5nZXRWYWxpZEZpbGVzKGZpbGVzKVxyXG5cclxuICAgIGlmKGZpbGVzLmxlbmd0aCE9dmFsaWRzLmxlbmd0aCl7XHJcbiAgICAgIHRoaXMubGFzdEludmFsaWRzID0gdGhpcy5nZXRJbnZhbGlkRmlsZXMoZmlsZXMpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgZGVsZXRlIHRoaXMubGFzdEludmFsaWRzXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMubGFzdEludmFsaWRzQ2hhbmdlLmVtaXQodGhpcy5sYXN0SW52YWxpZHMpXHJcblxyXG4gICAgaWYoIHZhbGlkcy5sZW5ndGggKXtcclxuICAgICAgaWYoIHRoaXMubmdmRml4T3JpZW50YXRpb24gKXtcclxuICAgICAgICB0aGlzLmFwcGx5RXhpZlJvdGF0aW9ucyh2YWxpZHMpXHJcbiAgICAgICAgLnRoZW4oIGZpeGVkRmlsZXM9PnRoaXMucXVlKGZpeGVkRmlsZXMpIClcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5xdWUodmFsaWRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNFbXB0eUFmdGVyU2VsZWN0aW9uKCkpIHtcclxuICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSAnJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcXVlKCBmaWxlczpGaWxlW10gKXtcclxuICAgIHRoaXMuZmlsZXMgPSB0aGlzLmZpbGVzIHx8IFtdXHJcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLmZpbGVzLCBmaWxlcylcclxuXHJcbiAgICAvL2JlbG93IGJyZWFrIG1lbW9yeSByZWYgYW5kIGRvZXNudCBhY3QgbGlrZSBhIHF1ZVxyXG4gICAgLy90aGlzLmZpbGVzID0gZmlsZXMvL2NhdXNlcyBtZW1vcnkgY2hhbmdlIHdoaWNoIHRyaWdnZXJzIGJpbmRpbmdzIGxpa2UgPG5nZkZvcm1EYXRhIFtmaWxlc109XCJmaWxlc1wiPjwvbmdmRm9ybURhdGE+XHJcbiAgICBcclxuICAgIHRoaXMuZmlsZXNDaGFuZ2UuZW1pdCggdGhpcy5maWxlcyApXHJcblxyXG4gICAgaWYoZmlsZXMubGVuZ3RoKXtcclxuICAgICAgdGhpcy5maWxlQ2hhbmdlLmVtaXQoIHRoaXMuZmlsZT1maWxlc1swXSApXHJcblxyXG4gICAgICBpZih0aGlzLmxhc3RCYXNlVXJsQ2hhbmdlLm9ic2VydmVycy5sZW5ndGgpe1xyXG4gICAgICAgIGRhdGFVcmwoIGZpbGVzWzBdIClcclxuICAgICAgICAudGhlbiggdXJsPT50aGlzLmxhc3RCYXNlVXJsQ2hhbmdlLmVtaXQodXJsKSApXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL3dpbGwgYmUgY2hlY2tlZCBmb3IgaW5wdXQgdmFsdWUgY2xlYXJpbmdcclxuICAgIHRoaXMubGFzdEZpbGVDb3VudCA9IHRoaXMuZmlsZXMubGVuZ3RoXHJcbiAgfVxyXG5cclxuICAvKiogY2FsbGVkIHdoZW4gaW5wdXQgaGFzIGZpbGVzICovXHJcbiAgY2hhbmdlRm4oZXZlbnQ6YW55KSB7XHJcbiAgICB2YXIgZmlsZUxpc3QgPSBldmVudC5fX2ZpbGVzXyB8fCAoZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5maWxlcylcclxuXHJcbiAgICBpZiAoIWZpbGVMaXN0KSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xyXG4gICAgdGhpcy5oYW5kbGVGaWxlcyhmaWxlTGlzdClcclxuICB9XHJcblxyXG4gIGNsaWNrSGFuZGxlcihldnQ6YW55KXtcclxuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50XHJcbiAgICBpZiAoZWxtLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSB8fCB0aGlzLmZpbGVEcm9wRGlzYWJsZWQpe1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciByID0gZGV0ZWN0U3dpcGUoZXZ0KTtcclxuICAgIC8vIHByZXZlbnQgdGhlIGNsaWNrIGlmIGl0IGlzIGEgc3dpcGVcclxuICAgIGlmICggciE9PWZhbHNlICkgcmV0dXJuIHI7XHJcblxyXG4gICAgY29uc3QgZmlsZUVsbSA9IHRoaXMucGFyYW1GaWxlRWxtKClcclxuICAgIGZpbGVFbG0uY2xpY2soKVxyXG4gICAgLy9maWxlRWxtLmRpc3BhdGNoRXZlbnQoIG5ldyBFdmVudCgnY2xpY2snKSApO1xyXG4gICAgdGhpcy5iZWZvcmVTZWxlY3QoKVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGJlZm9yZVNlbGVjdCgpe1xyXG4gICAgaWYoIHRoaXMuZmlsZXMgJiYgdGhpcy5sYXN0RmlsZUNvdW50PT09dGhpcy5maWxlcy5sZW5ndGggKXJldHVyblxyXG5cclxuICAgIC8vaWYgbm8gZmlsZXMgaW4gYXJyYXksIGJlIHN1cmUgYnJvd3NlciBkb2VzbnQgcHJldmVudCByZXNlbGVjdCBvZiBzYW1lIGZpbGUgKHNlZSBnaXRodWIgaXNzdWUgMjcpXHJcbiAgICB0aGlzLmZpbGVFbG0udmFsdWUgPSBudWxsXHJcbiAgfVxyXG5cclxuICBpc0VtcHR5QWZ0ZXJTZWxlY3Rpb24oKTpib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmF0dHJpYnV0ZXMubXVsdGlwbGU7XHJcbiAgfVxyXG5cclxuICBldmVudFRvVHJhbnNmZXIoZXZlbnQ6YW55KTphbnkge1xyXG4gICAgaWYoZXZlbnQuZGF0YVRyYW5zZmVyKXJldHVybiBldmVudC5kYXRhVHJhbnNmZXJcclxuICAgIHJldHVybiAgZXZlbnQub3JpZ2luYWxFdmVudCA/IGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyIDogbnVsbFxyXG4gIH1cclxuXHJcbiAgc3RvcEV2ZW50KGV2ZW50OmFueSk6YW55IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9XHJcblxyXG4gIHRyYW5zZmVySGFzRmlsZXModHJhbnNmZXI6YW55KTphbnkge1xyXG4gICAgaWYgKCF0cmFuc2Zlci50eXBlcykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRyYW5zZmVyLnR5cGVzLmluZGV4T2YpIHtcclxuICAgICAgcmV0dXJuIHRyYW5zZmVyLnR5cGVzLmluZGV4T2YoJ0ZpbGVzJykgIT09IC0xO1xyXG4gICAgfSBlbHNlIGlmICh0cmFuc2Zlci50eXBlcy5jb250YWlucykge1xyXG4gICAgICByZXR1cm4gdHJhbnNmZXIudHlwZXMuY29udGFpbnMoJ0ZpbGVzJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBldmVudFRvRmlsZXMoZXZlbnQ6RXZlbnQpe1xyXG4gICAgY29uc3QgdHJhbnNmZXIgPSB0aGlzLmV2ZW50VG9UcmFuc2ZlcihldmVudCk7XHJcbiAgICBpZiggdHJhbnNmZXIgKXtcclxuICAgICAgaWYodHJhbnNmZXIuZmlsZXMgJiYgdHJhbnNmZXIuZmlsZXMubGVuZ3RoKXtcclxuICAgICAgICByZXR1cm4gdHJhbnNmZXIuZmlsZXNcclxuICAgICAgfVxyXG4gICAgICBpZih0cmFuc2Zlci5pdGVtcyAmJiB0cmFuc2Zlci5pdGVtcy5sZW5ndGgpe1xyXG4gICAgICAgIHJldHVybiB0cmFuc2Zlci5pdGVtc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW11cclxuICB9XHJcblxyXG4gIGFwcGx5RXhpZlJvdGF0aW9ucyhcclxuICAgIGZpbGVzOkZpbGVbXVxyXG4gICk6UHJvbWlzZTxGaWxlW10+e1xyXG4gICAgY29uc3QgbWFwcGVyID0gKFxyXG4gICAgICBmaWxlOkZpbGUsaW5kZXg6bnVtYmVyXHJcbiAgICApOlByb21pc2U8YW55Pj0+e1xyXG4gICAgICByZXR1cm4gYXBwbHlFeGlmUm90YXRpb24oZmlsZSlcclxuICAgICAgLnRoZW4oIGZpeGVkRmlsZT0+ZmlsZXMuc3BsaWNlKGluZGV4LCAxLCBmaXhlZEZpbGUpIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwcm9tczpQcm9taXNlPGFueT5bXSA9IFtdXHJcbiAgICBmb3IobGV0IHg9ZmlsZXMubGVuZ3RoLTE7IHggPj0gMDsgLS14KXtcclxuICAgICAgcHJvbXNbeF0gPSBtYXBwZXIoIGZpbGVzW3hdLCB4IClcclxuICAgIH1cclxuICAgIHJldHVybiBQcm9taXNlLmFsbCggcHJvbXMgKS50aGVuKCAoKT0+ZmlsZXMgKVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQnXSlcclxuICBvbkNoYW5nZShldmVudDpFdmVudCk6dm9pZCB7XHJcbiAgICBsZXQgZmlsZXMgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5maWxlcyB8fCB0aGlzLmV2ZW50VG9GaWxlcyhldmVudClcclxuXHJcbiAgICBpZighZmlsZXMubGVuZ3RoKXJldHVyblxyXG5cclxuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgIHRoaXMuaGFuZGxlRmlsZXMoZmlsZXMpXHJcbiAgfVxyXG5cclxuICBnZXRGaWxlRmlsdGVyRmFpbE5hbWUoXHJcbiAgICBmaWxlOkZpbGVcclxuICApOnN0cmluZyB8IHVuZGVmaW5lZHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBpZiggIXRoaXMuZmlsdGVyc1tpXS5mbi5jYWxsKHRoaXMsIGZpbGUpICl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tpXS5uYW1lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWRcclxuICB9XHJcblxyXG4gIGlzRmlsZVZhbGlkKGZpbGU6RmlsZSk6Ym9vbGVhbntcclxuICAgIGNvbnN0IG5vRmlsdGVycyA9ICF0aGlzLmFjY2VwdCAmJiAoIXRoaXMuZmlsdGVycyB8fCAhdGhpcy5maWx0ZXJzLmxlbmd0aClcclxuICAgIGlmKCBub0ZpbHRlcnMgKXtcclxuICAgICAgcmV0dXJuIHRydWUvL3dlIGhhdmUgbm8gZmlsdGVycyBzbyBhbGwgZmlsZXMgYXJlIHZhbGlkXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLmdldEZpbGVGaWx0ZXJGYWlsTmFtZShmaWxlKSA/IGZhbHNlIDogdHJ1ZVxyXG4gIH1cclxuXHJcbiAgaXNGaWxlc1ZhbGlkKGZpbGVzOkZpbGVbXSl7XHJcbiAgICBmb3IobGV0IHg9ZmlsZXMubGVuZ3RoLTE7IHggPj0gMDsgLS14KXtcclxuICAgICAgaWYoICF0aGlzLmlzRmlsZVZhbGlkKGZpbGVzW3hdKSApe1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH1cclxuICBcclxuICBwcm90ZWN0ZWQgX2FjY2VwdEZpbHRlcihpdGVtOkZpbGUpOmJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGFjY2VwdFR5cGUodGhpcy5hY2NlcHQsIGl0ZW0udHlwZSwgaXRlbS5uYW1lKVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9maWxlU2l6ZUZpbHRlcihpdGVtOkZpbGUpOmJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEodGhpcy5tYXhTaXplICYmIGl0ZW0uc2l6ZSA+IHRoaXMubWF4U2l6ZSk7XHJcbiAgfVxyXG5cclxuICAvKiogYnJvd3NlcnMgdHJ5IGhhcmQgdG8gY29uY2VhbCBkYXRhIGFib3V0IGZpbGUgZHJhZ3MsIHRoaXMgdGVuZHMgdG8gdW5kbyB0aGF0ICovXHJcbiAgZmlsZXNUb1dyaXRlYWJsZU9iamVjdCggZmlsZXM6RmlsZVtdICk6ZHJhZ01ldGFbXXtcclxuICAgIGNvbnN0IGpzb25GaWxlczpkcmFnTWV0YVtdID0gW11cclxuICAgIGZvcihsZXQgeD0wOyB4IDwgZmlsZXMubGVuZ3RoOyArK3gpe1xyXG4gICAgICBqc29uRmlsZXMucHVzaCh7XHJcbiAgICAgICAgdHlwZTpmaWxlc1t4XS50eXBlLFxyXG4gICAgICAgIGtpbmQ6ZmlsZXNbeF1bXCJraW5kXCJdXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4ganNvbkZpbGVzXHJcbiAgfVxyXG59XHJcbiJdfQ==