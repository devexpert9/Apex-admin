import { __decorate } from "tslib";
import { Directive, EventEmitter, ElementRef, Input, Output, HostListener } from '@angular/core';
import { createInvisibleFileInputWrap, isFileInput, detectSwipe } from "./doc-event-help.functions";
import { acceptType, applyExifRotation, dataUrl } from "./fileTools";
/** A master base set of logic intended to support file select/drag/drop operations
 NOTE: Use ngfDrop for full drag/drop. Use ngfSelect for selecting
*/
let ngf = class ngf {
    constructor(element) {
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
    initFilters() {
        // the order is important
        this.filters.push({ name: 'accept', fn: this._acceptFilter });
        this.filters.push({ name: 'fileSize', fn: this._fileSizeFilter });
        //this.filters.push({name: 'fileType', fn: this._fileTypeFilter})
        //this.filters.push({name: 'queueLimit', fn: this._queueLimitFilter})
        //this.filters.push({name: 'mimeType', fn: this._mimeTypeFilter})
    }
    ngOnDestroy() {
        delete this.fileElm; //faster memory release of dom element
    }
    ngOnInit() {
        if (this.selectable) {
            this.enableSelecting();
        }
        if (this.multiple) {
            this.paramFileElm().setAttribute('multiple', this.multiple);
        }
        //create reference to this class with one cycle delay to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.directiveInit.emit(this);
        }, 0);
    }
    ngOnChanges(changes) {
        if (changes.accept) {
            this.paramFileElm().setAttribute('accept', changes.accept.currentValue || '*');
        }
    }
    paramFileElm() {
        if (this.fileElm)
            return this.fileElm; //already defined
        //elm is a file input
        const isFile = isFileInput(this.element.nativeElement);
        if (isFile)
            return this.fileElm = this.element.nativeElement;
        //create foo file input
        const label = createInvisibleFileInputWrap();
        this.fileElm = label.getElementsByTagName('input')[0];
        this.fileElm.addEventListener('change', this.changeFn.bind(this));
        this.element.nativeElement.appendChild(label);
        return this.fileElm;
    }
    enableSelecting() {
        let elm = this.element.nativeElement;
        if (isFileInput(elm)) {
            const bindedHandler = _ev => this.beforeSelect();
            elm.addEventListener('click', bindedHandler);
            elm.addEventListener('touchstart', bindedHandler);
            return;
        }
        const bindedHandler = ev => this.clickHandler(ev);
        elm.addEventListener('click', bindedHandler);
        elm.addEventListener('touchstart', bindedHandler);
        elm.addEventListener('touchend', bindedHandler);
    }
    getValidFiles(files) {
        const rtn = [];
        for (let x = files.length - 1; x >= 0; --x) {
            if (this.isFileValid(files[x])) {
                rtn.push(files[x]);
            }
        }
        return rtn;
    }
    getInvalidFiles(files) {
        const rtn = [];
        for (let x = files.length - 1; x >= 0; --x) {
            let failReason = this.getFileFilterFailName(files[x]);
            if (failReason) {
                rtn.push({
                    file: files[x],
                    type: failReason
                });
            }
        }
        return rtn;
    }
    handleFiles(files) {
        const valids = this.getValidFiles(files);
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
                    .then(fixedFiles => this.que(fixedFiles));
            }
            else {
                this.que(valids);
            }
        }
        if (this.isEmptyAfterSelection()) {
            this.element.nativeElement.value = '';
        }
    }
    que(files) {
        this.files = this.files || [];
        Array.prototype.push.apply(this.files, files);
        //below break memory ref and doesnt act like a que
        //this.files = files//causes memory change which triggers bindings like <ngfFormData [files]="files"></ngfFormData>
        this.filesChange.emit(this.files);
        if (files.length) {
            this.fileChange.emit(this.file = files[0]);
            if (this.lastBaseUrlChange.observers.length) {
                dataUrl(files[0])
                    .then(url => this.lastBaseUrlChange.emit(url));
            }
        }
        //will be checked for input value clearing
        this.lastFileCount = this.files.length;
    }
    /** called when input has files */
    changeFn(event) {
        var fileList = event.__files_ || (event.target && event.target.files);
        if (!fileList)
            return;
        this.stopEvent(event);
        this.handleFiles(fileList);
    }
    clickHandler(evt) {
        const elm = this.element.nativeElement;
        if (elm.getAttribute('disabled') || this.fileDropDisabled) {
            return false;
        }
        var r = detectSwipe(evt);
        // prevent the click if it is a swipe
        if (r !== false)
            return r;
        const fileElm = this.paramFileElm();
        fileElm.click();
        //fileElm.dispatchEvent( new Event('click') );
        this.beforeSelect();
        return false;
    }
    beforeSelect() {
        if (this.files && this.lastFileCount === this.files.length)
            return;
        //if no files in array, be sure browser doesnt prevent reselect of same file (see github issue 27)
        this.fileElm.value = null;
    }
    isEmptyAfterSelection() {
        return !!this.element.nativeElement.attributes.multiple;
    }
    eventToTransfer(event) {
        if (event.dataTransfer)
            return event.dataTransfer;
        return event.originalEvent ? event.originalEvent.dataTransfer : null;
    }
    stopEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    transferHasFiles(transfer) {
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
    }
    eventToFiles(event) {
        const transfer = this.eventToTransfer(event);
        if (transfer) {
            if (transfer.files && transfer.files.length) {
                return transfer.files;
            }
            if (transfer.items && transfer.items.length) {
                return transfer.items;
            }
        }
        return [];
    }
    applyExifRotations(files) {
        const mapper = (file, index) => {
            return applyExifRotation(file)
                .then(fixedFile => files.splice(index, 1, fixedFile));
        };
        const proms = [];
        for (let x = files.length - 1; x >= 0; --x) {
            proms[x] = mapper(files[x], x);
        }
        return Promise.all(proms).then(() => files);
    }
    onChange(event) {
        let files = this.element.nativeElement.files || this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    }
    getFileFilterFailName(file) {
        for (let i = 0; i < this.filters.length; i++) {
            if (!this.filters[i].fn.call(this, file)) {
                return this.filters[i].name;
            }
        }
        return undefined;
    }
    isFileValid(file) {
        const noFilters = !this.accept && (!this.filters || !this.filters.length);
        if (noFilters) {
            return true; //we have no filters so all files are valid
        }
        return this.getFileFilterFailName(file) ? false : true;
    }
    isFilesValid(files) {
        for (let x = files.length - 1; x >= 0; --x) {
            if (!this.isFileValid(files[x])) {
                return false;
            }
        }
        return true;
    }
    _acceptFilter(item) {
        return acceptType(this.accept, item.type, item.name);
    }
    _fileSizeFilter(item) {
        return !(this.maxSize && item.size > this.maxSize);
    }
    /** browsers try hard to conceal data about file drags, this tends to undo that */
    filesToWriteableObject(files) {
        const jsonFiles = [];
        for (let x = 0; x < files.length; ++x) {
            jsonFiles.push({
                type: files[x].type,
                kind: files[x]["kind"]
            });
        }
        return jsonFiles;
    }
};
ngf.ctorParameters = () => [
    { type: ElementRef }
];
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
export { ngf };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBQ25HLE9BQU8sRUFDTCxVQUFVLEVBQ1YsaUJBQWlCLEVBQUUsT0FBTyxFQUMzQixNQUFNLGFBQWEsQ0FBQTtBQU9wQjs7RUFFRTtBQUtGLElBQWEsR0FBRyxHQUFoQixNQUFhLEdBQUc7SUE0QmQsWUFBbUIsT0FBa0I7UUFBbEIsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQTFCckMsWUFBTyxHQUE0QyxFQUFFLENBQUE7UUFDckQsa0JBQWEsR0FBUSxDQUFDLENBQUE7UUFLdEIsK0JBQStCO1FBQy9CLCtCQUErQjtRQUN0QixzQkFBaUIsR0FBVyxJQUFJLENBQUE7UUFFaEMscUJBQWdCLEdBQVcsS0FBSyxDQUFBO1FBQ2hDLGVBQVUsR0FBVyxLQUFLLENBQUE7UUFDbkIsa0JBQWEsR0FBcUIsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUUzRCxpQkFBWSxHQUFxQixFQUFFLENBQUE7UUFDbEMsdUJBQWtCLEdBQTJDLElBQUksWUFBWSxFQUFFLENBQUE7UUFHL0Usc0JBQWlCLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUE7UUFHM0QsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFBO1FBRW5ELFVBQUssR0FBVSxFQUFFLENBQUE7UUFDaEIsZ0JBQVcsR0FBd0IsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUd0RSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQUVE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O3VDQUEyQjtBQUNuQjtJQUFmLE1BQU0sQ0FBQyxNQUFNLENBQUM7MENBQXFEO0FBRTNEO0lBQVIsS0FBSyxFQUFFO3lDQUFvQztBQUNsQztJQUFULE1BQU0sRUFBRTsrQ0FBZ0Y7QUFFaEY7SUFBUixLQUFLLEVBQUU7d0NBQXNCO0FBQ3BCO0lBQVQsTUFBTSxFQUFFOzhDQUE0RDtBQUU1RDtJQUFSLEtBQUssRUFBRTtpQ0FBYTtBQUNYO0lBQVQsTUFBTSxFQUFFO3VDQUFtRDtBQUVuRDtJQUFSLEtBQUssRUFBRTtrQ0FBa0I7QUFDaEI7SUFBVCxNQUFNLEVBQUU7d0NBQStEO0FBNk94RTtJQURDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzttQ0FRbEM7QUE5UVUsR0FBRztJQUpmLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFFBQVEsRUFBQyxLQUFLO0tBQ2YsQ0FBQztHQUNXLEdBQUcsQ0FnVWY7U0FoVVksR0FBRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBJbnB1dCwgT3V0cHV0LCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY3JlYXRlSW52aXNpYmxlRmlsZUlucHV0V3JhcCwgaXNGaWxlSW5wdXQsIGRldGVjdFN3aXBlIH0gZnJvbSBcIi4vZG9jLWV2ZW50LWhlbHAuZnVuY3Rpb25zXCJcclxuaW1wb3J0IHtcclxuICBhY2NlcHRUeXBlLCBJbnZhbGlkRmlsZUl0ZW0sXHJcbiAgYXBwbHlFeGlmUm90YXRpb24sIGRhdGFVcmxcclxufSBmcm9tIFwiLi9maWxlVG9vbHNcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBkcmFnTWV0YXtcclxuICB0eXBlOnN0cmluZ1xyXG4gIGtpbmQ6c3RyaW5nXHJcbn1cclxuXHJcbi8qKiBBIG1hc3RlciBiYXNlIHNldCBvZiBsb2dpYyBpbnRlbmRlZCB0byBzdXBwb3J0IGZpbGUgc2VsZWN0L2RyYWcvZHJvcCBvcGVyYXRpb25zXHJcbiBOT1RFOiBVc2UgbmdmRHJvcCBmb3IgZnVsbCBkcmFnL2Ryb3AuIFVzZSBuZ2ZTZWxlY3QgZm9yIHNlbGVjdGluZ1xyXG4qL1xyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogXCJbbmdmXVwiLFxyXG4gIGV4cG9ydEFzOlwibmdmXCJcclxufSlcclxuZXhwb3J0IGNsYXNzIG5nZiB7XHJcbiAgZmlsZUVsbTphbnlcclxuICBmaWx0ZXJzOntuYW1lOnN0cmluZywgZm46KGZpbGU6RmlsZSk9PmJvb2xlYW59W10gPSBbXVxyXG4gIGxhc3RGaWxlQ291bnQ6bnVtYmVyPTBcclxuXHJcbiAgQElucHV0KCkgbXVsdGlwbGUgITpzdHJpbmdcclxuICBASW5wdXQoKSBhY2NlcHQgICAhOnN0cmluZ1xyXG4gIEBJbnB1dCgpIG1heFNpemUgICE6bnVtYmVyXHJcbiAgLy9ASW5wdXQoKSBmb3JjZUZpbGVuYW1lOnN0cmluZ1xyXG4gIC8vQElucHV0KCkgZm9yY2VQb3N0bmFtZTpzdHJpbmdcclxuICBASW5wdXQoKSBuZ2ZGaXhPcmllbnRhdGlvbjpib29sZWFuID0gdHJ1ZVxyXG5cclxuICBASW5wdXQoKSBmaWxlRHJvcERpc2FibGVkOmJvb2xlYW4gPSBmYWxzZVxyXG4gIEBJbnB1dCgpIHNlbGVjdGFibGU6Ym9vbGVhbiA9IGZhbHNlXHJcbiAgQE91dHB1dCgnaW5pdCcpIGRpcmVjdGl2ZUluaXQ6RXZlbnRFbWl0dGVyPG5nZj4gPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuICBcclxuICBASW5wdXQoKSBsYXN0SW52YWxpZHM6SW52YWxpZEZpbGVJdGVtW10gPSBbXVxyXG4gIEBPdXRwdXQoKSBsYXN0SW52YWxpZHNDaGFuZ2U6RXZlbnRFbWl0dGVyPHtmaWxlOkZpbGUsdHlwZTpzdHJpbmd9W10+ID0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBJbnB1dCgpIGxhc3RCYXNlVXJsICE6IHN0cmluZy8vYmFzZTY0IGxhc3QgZmlsZSB1cGxvYWRlZCB1cmxcclxuICBAT3V0cHV0KCkgbGFzdEJhc2VVcmxDaGFuZ2U6RXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuICBcclxuICBASW5wdXQoKSBmaWxlICE6IEZpbGUvL2xhc3QgZmlsZSB1cGxvYWRlZFxyXG4gIEBPdXRwdXQoKSBmaWxlQ2hhbmdlOkV2ZW50RW1pdHRlcjxGaWxlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoKSBmaWxlczpGaWxlW10gPSBbXVxyXG4gIEBPdXRwdXQoKSBmaWxlc0NoYW5nZTpFdmVudEVtaXR0ZXI8RmlsZVtdPiA9IG5ldyBFdmVudEVtaXR0ZXI8RmlsZVtdPigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDpFbGVtZW50UmVmKXtcclxuICAgIHRoaXMuaW5pdEZpbHRlcnMoKVxyXG4gIH1cclxuXHJcbiAgaW5pdEZpbHRlcnMoKXtcclxuICAgIC8vIHRoZSBvcmRlciBpcyBpbXBvcnRhbnRcclxuICAgIHRoaXMuZmlsdGVycy5wdXNoKHtuYW1lOiAnYWNjZXB0JywgZm46IHRoaXMuX2FjY2VwdEZpbHRlcn0pXHJcbiAgICB0aGlzLmZpbHRlcnMucHVzaCh7bmFtZTogJ2ZpbGVTaXplJywgZm46IHRoaXMuX2ZpbGVTaXplRmlsdGVyfSlcclxuXHJcbiAgICAvL3RoaXMuZmlsdGVycy5wdXNoKHtuYW1lOiAnZmlsZVR5cGUnLCBmbjogdGhpcy5fZmlsZVR5cGVGaWx0ZXJ9KVxyXG4gICAgLy90aGlzLmZpbHRlcnMucHVzaCh7bmFtZTogJ3F1ZXVlTGltaXQnLCBmbjogdGhpcy5fcXVldWVMaW1pdEZpbHRlcn0pXHJcbiAgICAvL3RoaXMuZmlsdGVycy5wdXNoKHtuYW1lOiAnbWltZVR5cGUnLCBmbjogdGhpcy5fbWltZVR5cGVGaWx0ZXJ9KVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKXtcclxuICAgIGRlbGV0ZSB0aGlzLmZpbGVFbG0vL2Zhc3RlciBtZW1vcnkgcmVsZWFzZSBvZiBkb20gZWxlbWVudFxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuICAgIGlmKCB0aGlzLnNlbGVjdGFibGUgKXtcclxuICAgICAgdGhpcy5lbmFibGVTZWxlY3RpbmcoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCB0aGlzLm11bHRpcGxlICl7XHJcbiAgICAgIHRoaXMucGFyYW1GaWxlRWxtKCkuc2V0QXR0cmlidXRlKCdtdWx0aXBsZScsIHRoaXMubXVsdGlwbGUpXHJcbiAgICB9XHJcblxyXG4gICAgLy9jcmVhdGUgcmVmZXJlbmNlIHRvIHRoaXMgY2xhc3Mgd2l0aCBvbmUgY3ljbGUgZGVsYXkgdG8gYXZvaWQgRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvclxyXG4gICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICB0aGlzLmRpcmVjdGl2ZUluaXQuZW1pdCh0aGlzKVxyXG4gICAgfSwgMClcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKCBjaGFuZ2VzICl7XHJcbiAgICBpZiggY2hhbmdlcy5hY2NlcHQgKXtcclxuICAgICAgdGhpcy5wYXJhbUZpbGVFbG0oKS5zZXRBdHRyaWJ1dGUoJ2FjY2VwdCcsIGNoYW5nZXMuYWNjZXB0LmN1cnJlbnRWYWx1ZSB8fCAnKicpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwYXJhbUZpbGVFbG0oKXtcclxuICAgIGlmKCB0aGlzLmZpbGVFbG0gKXJldHVybiB0aGlzLmZpbGVFbG0vL2FscmVhZHkgZGVmaW5lZFxyXG4gICAgXHJcbiAgICAvL2VsbSBpcyBhIGZpbGUgaW5wdXRcclxuICAgIGNvbnN0IGlzRmlsZSA9IGlzRmlsZUlucHV0KCB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCApXHJcbiAgICBpZihpc0ZpbGUpcmV0dXJuIHRoaXMuZmlsZUVsbSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50XHJcbiAgICBcclxuICAgIC8vY3JlYXRlIGZvbyBmaWxlIGlucHV0XHJcbiAgICBjb25zdCBsYWJlbCA9IGNyZWF0ZUludmlzaWJsZUZpbGVJbnB1dFdyYXAoKVxyXG4gICAgdGhpcy5maWxlRWxtID0gbGFiZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF1cclxuICAgIHRoaXMuZmlsZUVsbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZUZuLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoIGxhYmVsIClcclxuICAgIHJldHVybiB0aGlzLmZpbGVFbG1cclxuICB9XHJcblxyXG4gIGVuYWJsZVNlbGVjdGluZygpe1xyXG4gICAgbGV0IGVsbSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50XHJcblxyXG4gICAgaWYoIGlzRmlsZUlucHV0KGVsbSkgKXtcclxuICAgICAgY29uc3QgYmluZGVkSGFuZGxlciA9IF9ldj0+dGhpcy5iZWZvcmVTZWxlY3QoKVxyXG4gICAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiaW5kZWRIYW5kbGVyKVxyXG4gICAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGJpbmRlZEhhbmRsZXIpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJpbmRlZEhhbmRsZXIgPSBldj0+dGhpcy5jbGlja0hhbmRsZXIoZXYpXHJcbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiaW5kZWRIYW5kbGVyKVxyXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBiaW5kZWRIYW5kbGVyKVxyXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgYmluZGVkSGFuZGxlcilcclxuICB9XHJcblxyXG4gIGdldFZhbGlkRmlsZXMoIGZpbGVzOkZpbGVbXSApOkZpbGVbXXtcclxuICAgIGNvbnN0IHJ0bjpGaWxlW10gPSBbXVxyXG4gICAgZm9yKGxldCB4PWZpbGVzLmxlbmd0aC0xOyB4ID49IDA7IC0teCl7XHJcbiAgICAgIGlmKCB0aGlzLmlzRmlsZVZhbGlkKGZpbGVzW3hdKSApe1xyXG4gICAgICAgIHJ0bi5wdXNoKCBmaWxlc1t4XSApXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBydG5cclxuICB9XHJcblxyXG4gIGdldEludmFsaWRGaWxlcyhmaWxlczpGaWxlW10pOkludmFsaWRGaWxlSXRlbVtde1xyXG4gICAgY29uc3QgcnRuOkludmFsaWRGaWxlSXRlbVtdID0gW11cclxuICAgIGZvcihsZXQgeD1maWxlcy5sZW5ndGgtMTsgeCA+PSAwOyAtLXgpe1xyXG4gICAgICBsZXQgZmFpbFJlYXNvbiA9IHRoaXMuZ2V0RmlsZUZpbHRlckZhaWxOYW1lKGZpbGVzW3hdKVxyXG4gICAgICBpZiggZmFpbFJlYXNvbiApe1xyXG4gICAgICAgIHJ0bi5wdXNoKHtcclxuICAgICAgICAgIGZpbGUgOiBmaWxlc1t4XSxcclxuICAgICAgICAgIHR5cGUgOiBmYWlsUmVhc29uXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJ0blxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsZXMoZmlsZXM6RmlsZVtdKXtcclxuICAgIGNvbnN0IHZhbGlkcyA9IHRoaXMuZ2V0VmFsaWRGaWxlcyhmaWxlcylcclxuXHJcbiAgICBpZihmaWxlcy5sZW5ndGghPXZhbGlkcy5sZW5ndGgpe1xyXG4gICAgICB0aGlzLmxhc3RJbnZhbGlkcyA9IHRoaXMuZ2V0SW52YWxpZEZpbGVzKGZpbGVzKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmxhc3RJbnZhbGlkc1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLmxhc3RJbnZhbGlkc0NoYW5nZS5lbWl0KHRoaXMubGFzdEludmFsaWRzKVxyXG5cclxuICAgIGlmKCB2YWxpZHMubGVuZ3RoICl7XHJcbiAgICAgIGlmKCB0aGlzLm5nZkZpeE9yaWVudGF0aW9uICl7XHJcbiAgICAgICAgdGhpcy5hcHBseUV4aWZSb3RhdGlvbnModmFsaWRzKVxyXG4gICAgICAgIC50aGVuKCBmaXhlZEZpbGVzPT50aGlzLnF1ZShmaXhlZEZpbGVzKSApXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMucXVlKHZhbGlkcylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRW1wdHlBZnRlclNlbGVjdGlvbigpKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJydcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHF1ZSggZmlsZXM6RmlsZVtdICl7XHJcbiAgICB0aGlzLmZpbGVzID0gdGhpcy5maWxlcyB8fCBbXVxyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5maWxlcywgZmlsZXMpXHJcblxyXG4gICAgLy9iZWxvdyBicmVhayBtZW1vcnkgcmVmIGFuZCBkb2VzbnQgYWN0IGxpa2UgYSBxdWVcclxuICAgIC8vdGhpcy5maWxlcyA9IGZpbGVzLy9jYXVzZXMgbWVtb3J5IGNoYW5nZSB3aGljaCB0cmlnZ2VycyBiaW5kaW5ncyBsaWtlIDxuZ2ZGb3JtRGF0YSBbZmlsZXNdPVwiZmlsZXNcIj48L25nZkZvcm1EYXRhPlxyXG4gICAgXHJcbiAgICB0aGlzLmZpbGVzQ2hhbmdlLmVtaXQoIHRoaXMuZmlsZXMgKVxyXG5cclxuICAgIGlmKGZpbGVzLmxlbmd0aCl7XHJcbiAgICAgIHRoaXMuZmlsZUNoYW5nZS5lbWl0KCB0aGlzLmZpbGU9ZmlsZXNbMF0gKVxyXG5cclxuICAgICAgaWYodGhpcy5sYXN0QmFzZVVybENoYW5nZS5vYnNlcnZlcnMubGVuZ3RoKXtcclxuICAgICAgICBkYXRhVXJsKCBmaWxlc1swXSApXHJcbiAgICAgICAgLnRoZW4oIHVybD0+dGhpcy5sYXN0QmFzZVVybENoYW5nZS5lbWl0KHVybCkgKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy93aWxsIGJlIGNoZWNrZWQgZm9yIGlucHV0IHZhbHVlIGNsZWFyaW5nXHJcbiAgICB0aGlzLmxhc3RGaWxlQ291bnQgPSB0aGlzLmZpbGVzLmxlbmd0aFxyXG4gIH1cclxuXHJcbiAgLyoqIGNhbGxlZCB3aGVuIGlucHV0IGhhcyBmaWxlcyAqL1xyXG4gIGNoYW5nZUZuKGV2ZW50OmFueSkge1xyXG4gICAgdmFyIGZpbGVMaXN0ID0gZXZlbnQuX19maWxlc18gfHwgKGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQuZmlsZXMpXHJcblxyXG4gICAgaWYgKCFmaWxlTGlzdCkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgIHRoaXMuaGFuZGxlRmlsZXMoZmlsZUxpc3QpXHJcbiAgfVxyXG5cclxuICBjbGlja0hhbmRsZXIoZXZ0OmFueSl7XHJcbiAgICBjb25zdCBlbG0gPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudFxyXG4gICAgaWYgKGVsbS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgfHwgdGhpcy5maWxlRHJvcERpc2FibGVkKXtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgciA9IGRldGVjdFN3aXBlKGV2dCk7XHJcbiAgICAvLyBwcmV2ZW50IHRoZSBjbGljayBpZiBpdCBpcyBhIHN3aXBlXHJcbiAgICBpZiAoIHIhPT1mYWxzZSApIHJldHVybiByO1xyXG5cclxuICAgIGNvbnN0IGZpbGVFbG0gPSB0aGlzLnBhcmFtRmlsZUVsbSgpXHJcbiAgICBmaWxlRWxtLmNsaWNrKClcclxuICAgIC8vZmlsZUVsbS5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoJ2NsaWNrJykgKTtcclxuICAgIHRoaXMuYmVmb3JlU2VsZWN0KClcclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBiZWZvcmVTZWxlY3QoKXtcclxuICAgIGlmKCB0aGlzLmZpbGVzICYmIHRoaXMubGFzdEZpbGVDb3VudD09PXRoaXMuZmlsZXMubGVuZ3RoIClyZXR1cm5cclxuXHJcbiAgICAvL2lmIG5vIGZpbGVzIGluIGFycmF5LCBiZSBzdXJlIGJyb3dzZXIgZG9lc250IHByZXZlbnQgcmVzZWxlY3Qgb2Ygc2FtZSBmaWxlIChzZWUgZ2l0aHViIGlzc3VlIDI3KVxyXG4gICAgdGhpcy5maWxlRWxtLnZhbHVlID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgaXNFbXB0eUFmdGVyU2VsZWN0aW9uKCk6Ym9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5hdHRyaWJ1dGVzLm11bHRpcGxlO1xyXG4gIH1cclxuXHJcbiAgZXZlbnRUb1RyYW5zZmVyKGV2ZW50OmFueSk6YW55IHtcclxuICAgIGlmKGV2ZW50LmRhdGFUcmFuc2ZlcilyZXR1cm4gZXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICByZXR1cm4gIGV2ZW50Lm9yaWdpbmFsRXZlbnQgPyBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2ZlciA6IG51bGxcclxuICB9XHJcblxyXG4gIHN0b3BFdmVudChldmVudDphbnkpOmFueSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICB0cmFuc2Zlckhhc0ZpbGVzKHRyYW5zZmVyOmFueSk6YW55IHtcclxuICAgIGlmICghdHJhbnNmZXIudHlwZXMpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0cmFuc2Zlci50eXBlcy5pbmRleE9mKSB7XHJcbiAgICAgIHJldHVybiB0cmFuc2Zlci50eXBlcy5pbmRleE9mKCdGaWxlcycpICE9PSAtMTtcclxuICAgIH0gZWxzZSBpZiAodHJhbnNmZXIudHlwZXMuY29udGFpbnMpIHtcclxuICAgICAgcmV0dXJuIHRyYW5zZmVyLnR5cGVzLmNvbnRhaW5zKCdGaWxlcycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXZlbnRUb0ZpbGVzKGV2ZW50OkV2ZW50KXtcclxuICAgIGNvbnN0IHRyYW5zZmVyID0gdGhpcy5ldmVudFRvVHJhbnNmZXIoZXZlbnQpO1xyXG4gICAgaWYoIHRyYW5zZmVyICl7XHJcbiAgICAgIGlmKHRyYW5zZmVyLmZpbGVzICYmIHRyYW5zZmVyLmZpbGVzLmxlbmd0aCl7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zZmVyLmZpbGVzXHJcbiAgICAgIH1cclxuICAgICAgaWYodHJhbnNmZXIuaXRlbXMgJiYgdHJhbnNmZXIuaXRlbXMubGVuZ3RoKXtcclxuICAgICAgICByZXR1cm4gdHJhbnNmZXIuaXRlbXNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICBhcHBseUV4aWZSb3RhdGlvbnMoXHJcbiAgICBmaWxlczpGaWxlW11cclxuICApOlByb21pc2U8RmlsZVtdPntcclxuICAgIGNvbnN0IG1hcHBlciA9IChcclxuICAgICAgZmlsZTpGaWxlLGluZGV4Om51bWJlclxyXG4gICAgKTpQcm9taXNlPGFueT49PntcclxuICAgICAgcmV0dXJuIGFwcGx5RXhpZlJvdGF0aW9uKGZpbGUpXHJcbiAgICAgIC50aGVuKCBmaXhlZEZpbGU9PmZpbGVzLnNwbGljZShpbmRleCwgMSwgZml4ZWRGaWxlKSApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJvbXM6UHJvbWlzZTxhbnk+W10gPSBbXVxyXG4gICAgZm9yKGxldCB4PWZpbGVzLmxlbmd0aC0xOyB4ID49IDA7IC0teCl7XHJcbiAgICAgIHByb21zW3hdID0gbWFwcGVyKCBmaWxlc1t4XSwgeCApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHByb21zICkudGhlbiggKCk9PmZpbGVzIClcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScsIFsnJGV2ZW50J10pXHJcbiAgb25DaGFuZ2UoZXZlbnQ6RXZlbnQpOnZvaWQge1xyXG4gICAgbGV0IGZpbGVzID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZmlsZXMgfHwgdGhpcy5ldmVudFRvRmlsZXMoZXZlbnQpXHJcblxyXG4gICAgaWYoIWZpbGVzLmxlbmd0aClyZXR1cm5cclxuXHJcbiAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XHJcbiAgICB0aGlzLmhhbmRsZUZpbGVzKGZpbGVzKVxyXG4gIH1cclxuXHJcbiAgZ2V0RmlsZUZpbHRlckZhaWxOYW1lKFxyXG4gICAgZmlsZTpGaWxlXHJcbiAgKTpzdHJpbmcgfCB1bmRlZmluZWR7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgaWYoICF0aGlzLmZpbHRlcnNbaV0uZm4uY2FsbCh0aGlzLCBmaWxlKSApe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpbHRlcnNbaV0ubmFtZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICBpc0ZpbGVWYWxpZChmaWxlOkZpbGUpOmJvb2xlYW57XHJcbiAgICBjb25zdCBub0ZpbHRlcnMgPSAhdGhpcy5hY2NlcHQgJiYgKCF0aGlzLmZpbHRlcnMgfHwgIXRoaXMuZmlsdGVycy5sZW5ndGgpXHJcbiAgICBpZiggbm9GaWx0ZXJzICl7XHJcbiAgICAgIHJldHVybiB0cnVlLy93ZSBoYXZlIG5vIGZpbHRlcnMgc28gYWxsIGZpbGVzIGFyZSB2YWxpZFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlRmlsdGVyRmFpbE5hbWUoZmlsZSkgPyBmYWxzZSA6IHRydWVcclxuICB9XHJcblxyXG4gIGlzRmlsZXNWYWxpZChmaWxlczpGaWxlW10pe1xyXG4gICAgZm9yKGxldCB4PWZpbGVzLmxlbmd0aC0xOyB4ID49IDA7IC0teCl7XHJcbiAgICAgIGlmKCAhdGhpcy5pc0ZpbGVWYWxpZChmaWxlc1t4XSkgKXtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcbiAgXHJcbiAgcHJvdGVjdGVkIF9hY2NlcHRGaWx0ZXIoaXRlbTpGaWxlKTpib29sZWFuIHtcclxuICAgIHJldHVybiBhY2NlcHRUeXBlKHRoaXMuYWNjZXB0LCBpdGVtLnR5cGUsIGl0ZW0ubmFtZSlcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfZmlsZVNpemVGaWx0ZXIoaXRlbTpGaWxlKTpib29sZWFuIHtcclxuICAgIHJldHVybiAhKHRoaXMubWF4U2l6ZSAmJiBpdGVtLnNpemUgPiB0aGlzLm1heFNpemUpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGJyb3dzZXJzIHRyeSBoYXJkIHRvIGNvbmNlYWwgZGF0YSBhYm91dCBmaWxlIGRyYWdzLCB0aGlzIHRlbmRzIHRvIHVuZG8gdGhhdCAqL1xyXG4gIGZpbGVzVG9Xcml0ZWFibGVPYmplY3QoIGZpbGVzOkZpbGVbXSApOmRyYWdNZXRhW117XHJcbiAgICBjb25zdCBqc29uRmlsZXM6ZHJhZ01ldGFbXSA9IFtdXHJcbiAgICBmb3IobGV0IHg9MDsgeCA8IGZpbGVzLmxlbmd0aDsgKyt4KXtcclxuICAgICAganNvbkZpbGVzLnB1c2goe1xyXG4gICAgICAgIHR5cGU6ZmlsZXNbeF0udHlwZSxcclxuICAgICAgICBraW5kOmZpbGVzW3hdW1wia2luZFwiXVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGpzb25GaWxlc1xyXG4gIH1cclxufVxyXG4iXX0=