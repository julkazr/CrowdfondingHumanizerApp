import { Component, OnInit, OnDestroy } from '@angular/core';
import { HcaService } from '../services/hca.service';
import { DonationsService } from '../services/donations.service';
import { Observable } from 'rxjs';
import { Event as AppEvent } from '../models/event.model';
import { Donation } from '../models/donation.model';

@Component({
  selector: 'app-community-account',
  templateUrl: './community-account.component.html',
  styleUrls: ['./community-account.component.css']
})
export class CommunityAccountComponent implements OnInit {
  public hcaFunds: Observable<number>;
  public hcaEvents: Observable<AppEvent[]>;
  public hcaDonations: Observable<Donation[]>;

  constructor(private hcas: HcaService) {}

  ngOnInit() {
    this.updateEventStatuses();
    this.hcaFunds = this.hcas.getFunds();
    this.hcaEvents = this.hcas.getHCAEvents();
    this.hcaDonations = this.hcas.getHCADonations();
  }

  updateEventStatuses() {
    this.hcas.updateEventStatuses();
  }

  distributeFunds() {
    this.hcas.distributeFunds();
  }
}
