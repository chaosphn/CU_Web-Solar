import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule, MatMenuModule, MatProgressBarModule, MatPaginatorModule } from '@angular/material';

const comps = [
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatProgressBarModule,
    MatPaginatorModule
];

@NgModule({
    declarations: [

    ],
    imports: [
        comps
    ],
    exports: [
        comps
    ],
    providers: [],
    bootstrap: []
})
export class MaterialModule { }
