import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { DashboardConfigsState } from '../stores/configs/dashboard/dashboard-configs.state';
import { DiagramConfigsState } from '../stores/configs/diagram/diagram-config.state';
import { DashboardLastValuesState } from '../stores/last-values/dashboard/dashboard-last-values.state';
import { DiagramLastValuesState } from '../stores/last-values/diagram/diagram-last-values.state';
import { DashboardRequestState } from '../stores/requests/dashboard/dashboard-request.state';
import { DiagramRequestState } from '../stores/requests/diagram/diagram-request.state';
import { ServersState } from '../stores/servers/servers.state';
import { TagsState } from '../stores/tags/tags.state';
import { UserState } from '../stores/user/user.state';
import { PowerLastValuesState } from '../stores/last-values/powermeter/power-last-values.state';
import { PowerConfigsState } from '../stores/configs/powermeter/power-config.state';
import { PowerRequestState } from '../stores/requests/powermeter/power-request.state';
import { InverterLastValuesState } from '../stores/last-values/inverter/inverter-last-values.state';
import { InverterConfigsState } from '../stores/configs/inverter/inverter-config.state';
import { InverterRequestState } from '../stores/requests/inverter/inverter-request.state';
import { SitesState } from '../stores/sites/sites.state';
import { BuildingState } from '../stores/building/building.state';




@NgModule({
    declarations: [

    ],
    imports: [
        NgxsModule.forRoot([
            ServersState,
            TagsState,
            DashboardConfigsState,
            DashboardRequestState,
            DashboardLastValuesState,
            DiagramConfigsState,
            DiagramRequestState,
            DiagramLastValuesState,
            UserState,
            PowerLastValuesState,
            PowerConfigsState,
            PowerRequestState,
            InverterLastValuesState,
            InverterRequestState,
            InverterConfigsState,
            SitesState,
            BuildingState
        ]),
        NgxsReduxDevtoolsPluginModule.forRoot()
    ],
    exports: [
        NgxsModule,
        NgxsReduxDevtoolsPluginModule
    ],
    providers: [],
    bootstrap: []
})
export class StoreModule { }
