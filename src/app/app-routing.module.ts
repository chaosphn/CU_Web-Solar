import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { AuthGuard } from './routings/guards/auth-guards.service';
import { ServerResolver } from './routings/resolvers/server.resolver';
import { DashboardComponent } from './dashboardtv/dashboard.component';


const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: '/main/dashboard1',
        pathMatch: 'full',
    },
    {
        path: 'main',
        component: NavbarComponent,
        canActivate: [AuthGuard],
        resolve: {
            server: ServerResolver
        },
        children: [
            {
                path: 'dashboardtv',
                loadChildren: 'src/app/dashboardtv/dashboard.module#DashboardModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'dashboard',
                loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'dashboard1',
                loadChildren: 'src/app/dashboard1/dashboard.module#DashboardModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'dashboard2',
                loadChildren: 'src/app/dashboard2/dashboard.module#DashboardModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'dashboard3',
                loadChildren: 'src/app/dashboard3/dashboard.module#DashboardModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'topology',
                loadChildren: 'src/app/diagram/diagram.module#DiagramModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'diagram',
                loadChildren: 'src/app/diagrams/diagrams.module#DiagramsModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'powermeters',
                loadChildren: 'src/app/powermeters/powermeters.module#PowermetersModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'inverters',
                loadChildren: 'src/app/inverters/inverters.module#InvertersModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'charts',
                loadChildren: 'src/app/charts/charts.module#ChartsModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'reports',
                loadChildren: 'src/app/reports/reports.module#ReportsModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'events',
                loadChildren: 'src/app/events/events.module#EventsModule',
                canActivateChild: [ AuthGuard ]
            },
            {
                path: 'admin',
                loadChildren: 'src/app/admin/admin.module#AdminModule',
                //canActivateChild: [ AuthGuard ]
            }
        ]
    },
    {
        path: 'not-found',
        component: PageNotFoundComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        preloadingStrategy: PreloadAllModules
    })],

    exports: [RouterModule]
})
export class AppRoutingModule { }
