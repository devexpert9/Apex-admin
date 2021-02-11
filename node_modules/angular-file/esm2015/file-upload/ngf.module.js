import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ngfBackground } from './ngfBackground.directive';
import { ngfDrop } from './ngfDrop.directive';
import { ngf } from './ngf.directive';
import { ngfSelect } from './ngfSelect.directive';
import { ngfUploadStatus } from './ngfUploadStatus.directive';
import { ngfFormData } from './ngfFormData.directive';
import { ngfSrc } from './ngfSrc.directive';
//import{ HttpModule } from '@angular/http';
const declarations = [
    ngfDrop,
    ngfSelect,
    ngfBackground,
    ngfSrc,
    ngfUploadStatus,
    ngfFormData,
    ngf
];
let ngfModule = class ngfModule {
};
ngfModule = __decorate([
    NgModule({
        imports: [
            CommonModule
            //,HttpModule
        ],
        declarations: declarations,
        exports: declarations //[HttpModule, ...declarations]
    })
], ngfModule);
export { ngfModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdmLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS8iLCJzb3VyY2VzIjpbImZpbGUtdXBsb2FkL25nZi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1Qyw0Q0FBNEM7QUFFNUMsTUFBTSxZQUFZLEdBQUc7SUFDbkIsT0FBTztJQUNQLFNBQVM7SUFDVCxhQUFhO0lBQ2IsTUFBTTtJQUNOLGVBQWU7SUFDZixXQUFXO0lBQ1gsR0FBRztDQUNKLENBQUE7QUFTRSxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO0NBQUcsQ0FBQTtBQUFaLFNBQVM7SUFQeEIsUUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1AsWUFBWTtZQUNaLGFBQWE7U0FDZDtRQUNELFlBQVksRUFBRSxZQUFZO1FBQzFCLE9BQU8sRUFBRSxZQUFZLENBQUEsK0JBQStCO0tBQ3JELENBQUM7R0FBYyxTQUFTLENBQUc7U0FBWixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IG5nZkJhY2tncm91bmQgfSBmcm9tICcuL25nZkJhY2tncm91bmQuZGlyZWN0aXZlJztcbmltcG9ydCB7IG5nZkRyb3AgfSBmcm9tICcuL25nZkRyb3AuZGlyZWN0aXZlJztcbmltcG9ydCB7IG5nZiB9IGZyb20gJy4vbmdmLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBuZ2ZTZWxlY3QgfSBmcm9tICcuL25nZlNlbGVjdC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgbmdmVXBsb2FkU3RhdHVzIH0gZnJvbSAnLi9uZ2ZVcGxvYWRTdGF0dXMuZGlyZWN0aXZlJztcbmltcG9ydCB7IG5nZkZvcm1EYXRhIH0gZnJvbSAnLi9uZ2ZGb3JtRGF0YS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgbmdmU3JjIH0gZnJvbSAnLi9uZ2ZTcmMuZGlyZWN0aXZlJztcbi8vaW1wb3J0eyBIdHRwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5cbmNvbnN0IGRlY2xhcmF0aW9ucyA9IFtcbiAgbmdmRHJvcCxcbiAgbmdmU2VsZWN0LFxuICBuZ2ZCYWNrZ3JvdW5kLFxuICBuZ2ZTcmMsXG4gIG5nZlVwbG9hZFN0YXR1cyxcbiAgbmdmRm9ybURhdGEsXG4gIG5nZlxuXVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gICAgLy8sSHR0cE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IGRlY2xhcmF0aW9ucyxcbiAgZXhwb3J0czogZGVjbGFyYXRpb25zLy9bSHR0cE1vZHVsZSwgLi4uZGVjbGFyYXRpb25zXVxufSkgZXhwb3J0IGNsYXNzIG5nZk1vZHVsZSB7fSJdfQ==