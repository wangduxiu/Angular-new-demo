import { NgModule } from '@angular/core';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import { ConfigService } from './config-service';

@NgModule({
  providers: [
    AzureMonitoringService,
    ConfigService
  ],
})
export class ConfigServiceModule {
}
