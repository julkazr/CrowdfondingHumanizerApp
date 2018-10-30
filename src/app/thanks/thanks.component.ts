import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.css']
})
export class ThanksComponent implements OnInit {
  public id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    setTimeout(() => {  this.router.navigate(['/event', this.id]); }, 5000);
  }

  onBack() {
    // this.id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/event', this.id]);
  }

}
