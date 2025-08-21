import { Component, OnInit } from '@angular/core';
import { PropiedadesModel } from 'src/app/data/interfaces/propiedades.model';
import { CatalogoPropiedadesService } from 'src/app/data/service/catalogo-propiedades.service';

@Component({
  selector: 'app-casa1',
  templateUrl: './casa1.component.html',
  styleUrls: ['./casa1.component.css']
})
export class Casa1Component implements OnInit {

  propiedades: PropiedadesModel[] = [];

  constructor(
    private catalogoPropiedadesService: CatalogoPropiedadesService
  ) {}


  ngOnInit() {
    this.propiedades = this.catalogoPropiedadesService.getPropiedades();
    console.log(this.propiedades);
  }


}
