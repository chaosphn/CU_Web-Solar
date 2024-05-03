import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { ServersStateModel } from '../../core/stores/servers/servers.model';
import { SetServer } from '../../core/stores/servers/servers.state';
import { HttpService } from '../../share/services/http.service';


@Injectable({
  providedIn: 'root'
})
export class ServerResolver implements Resolve<string> {
  constructor(private httpService: HttpService,
    private store: Store) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const serverConfig: any = await this.httpService.getConfig('assets/servers/servers.config.json');
    const server: ServersStateModel = {
        serverSelected: serverConfig.serverName
    };
    this.store.dispatch(new SetServer(server));
    return server;
  }
}
