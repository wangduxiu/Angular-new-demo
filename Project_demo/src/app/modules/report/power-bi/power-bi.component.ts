import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { logger } from 'app/core/util/logger';
import * as pbi from 'powerbi-client';
import { PowerBIConfig } from '../../../core/store/stock/stock.interface';

@Component({
  selector: 'app-power-bi-page',
  templateUrl: './power-bi.component.html',
  styleUrls: ['./power-bi.component.less'],
})
export class PowerBIComponent {

  @ViewChild('reportContainer') reportContainer: ElementRef;
  @Input() powerBIConfig: PowerBIConfig;

  powerbi: any; // this is the powerbi-client

  message: string = "";

  constructor() {
    logger.debug(pbi);
    this.powerbi = pbi;
    this.powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.powerBIConfig && this.powerBIConfig.errorMessage) {
      this.message = "REPORT.POWER_BI_UNAVAILABLE";
    }
  }

  ngAfterViewInit() {
    if (!this.powerBIConfig.errorMessage) {
      let config = {
        type: 'report',
        tokenType: pbi.models.TokenType.Embed,
        permissions: pbi.models.Permissions.All,
        accessToken: this.powerBIConfig.embedToken.token,
        embedUrl: this.powerBIConfig.embedUrl,
        id: this.powerBIConfig.id,
        settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
        }
      };
      this.powerbi.embed(this.reportContainer['nativeElement'], config);
    }
  }

}
