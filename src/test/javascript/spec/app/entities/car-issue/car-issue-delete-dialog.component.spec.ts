/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarIssueDeleteDialogComponent } from 'app/entities/car-issue/car-issue-delete-dialog.component';
import { CarIssueService } from 'app/entities/car-issue/car-issue.service';

describe('Component Tests', () => {
    describe('CarIssue Management Delete Component', () => {
        let comp: CarIssueDeleteDialogComponent;
        let fixture: ComponentFixture<CarIssueDeleteDialogComponent>;
        let service: CarIssueService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarIssueDeleteDialogComponent]
            })
                .overrideTemplate(CarIssueDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarIssueDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarIssueService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it(
                'Should call delete service on confirmDelete',
                inject(
                    [],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });
});
