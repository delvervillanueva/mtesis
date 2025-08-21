import { Injectable } from '@angular/core';
import { PropiedadesModel } from '../interfaces/propiedades.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogoPropiedadesService {


  private propiedades:  PropiedadesModel[] =
    [
      {
      "descripcion1": {
        id: 1,
        imgPrincipal: "/assets/img/cards-casas/casa-lara/cuarto-grande-slide1.JPEG",
        direccion: "Jr. Lara Cuadra 10",
        area: "121m²",
        dormitorios: 7,
        precio: "S/650 mil"
      }
    }
    ];

    constructor(){
      console.log("Servicio listooo!!!!!");
  }

  getPropiedades() {
    return this.propiedades;
}


}
