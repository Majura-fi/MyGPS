import { Component, OnInit, Input } from '@angular/core';

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LineString from 'ol/geom/LineString';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import * as proj from 'ol/proj';
import Point from 'ol/geom/Point';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { RecordedLocation } from '../../models/recordedlocation.model';
import { Path } from '../../models/path.model';
import Layer from 'ol/layer/Layer';

interface DrawPinOptions {
  /** Pin location. */
  location: RecordedLocation;
}

interface DrawPathOptions {
  /** Location points that form the path. */
  locationPoints: RecordedLocation[];
}

@Component({
  selector: 'app-map',
  styles: ['#map-impl { width:100%; height: 100%; display: block; }'],
  template: '<div (resized)="onResized($event)" id="map-impl"></div>'
})
export class GPSMapComponent implements OnInit {
  private appmap: Map;
  private resizeTimeout: any;
  private _layers: { [name: string]: Layer } = this._setupLayers();

  ngOnInit(): void {
    const centerView = proj.transform(
      [23.822129, 61.49338], // Tampere ;)
      'EPSG:4326',
      'EPSG:3857'
    );

    this.appmap = new Map({
      target: 'map-impl',
      layers: Object.values(this._layers),
      view: new View({
        center: centerView,
        zoom: 5
      })
    });
  }

  private _setupLayers(): { [name: string]: Layer } {
    const layers: { [name: string]: Layer } = {};

    layers.tiles = new TileLayer({
      source: new OSM()
    });

    layers.path = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({ color: '#FF0000' }),
        stroke: new Stroke({ color: '#FF0000', width: 4 })
      })
    });

    layers.pins = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: IconAnchorUnits.FRACTION,
          anchorYUnits: IconAnchorUnits.FRACTION,
          src: 'assets/images/map-icon.png',
          size: [512, 512],
          scale: 0.0625
        })
      })
    });

    return layers;
  }

  /**
   * Clears the map from pins and paths.
   */
  public clearAll() {
    this.clearPins();
    this.clearPaths();
  }

  /**
   * Draw a path on the map and clear all other paths.
   * @param path Path to draw.
   */
  public setPath(path: Path) {
    this.clearPaths();
    if (!path) {
      return;
    }

    this._drawPath({ locationPoints: path.points });
  }

  /**
   * Set a pin on the map and remove all other pins.
   * @param location Location of the pin.
   */
  public setPin(location: RecordedLocation) {
    this.clearPins();
    if (!location) {
      return;
    }

    this._drawPin({ location: location });
    this.setCenter(location);
  }

  /**
   * Called automatically when the browser's window size changes.
   */
  onResized(_) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.updateSize();
    }, 100);
  }

  /**
   * Causes map to refresh its viewport.
   */
  public updateSize() {
    this.appmap.updateSize();
  }

  /**
   * Centers the map view on spesific coordinates.
   * @param location
   */
  public setCenter(location: RecordedLocation) {
    let view = this.appmap.getView();
    view.setCenter(this.RecordedLocationToCoordinates(location));
  }

  /**
   * Clears all pins that are drawn on the map.
   */
  public clearPins(): void {
    const layer = this._layers.pins as VectorLayer;
    layer.getSource().clear();
  }

  /**
   * Clears all drawn paths that are drawn on the map.
   */
  public clearPaths(): void {
    const layer = this._layers.path as VectorLayer;
    layer.getSource().clear();
  }

  /**
   * Draws a pin on the map.
   * @param options Drawing options.
   */
  private _drawPin(options: DrawPinOptions) {
    const coordinates = this.RecordedLocationToCoordinates(options.location);
    const newFeature = new Feature({ geometry: new Point(coordinates) });
    const layer = this._layers.pins as VectorLayer;
    layer.getSource().addFeature(newFeature);
  }

  /**
   * Draws a path on the map.
   * @param options Drawing options.
   */
  private _drawPath(options: DrawPathOptions): void {
    const points = options.locationPoints.map(val =>
      this.RecordedLocationToCoordinates(val)
    );
    const newFeature = new Feature({ geometry: new LineString(points) });
    const layer = this._layers.path as VectorLayer;
    layer.getSource().addFeature(newFeature);
  }

  /**
   * Converts RecordedLocation type to plain coordinates array.
   *
   * The default projection is Spherical Mercator (EPSG:3857),
   * Android records coordinates with EPSG:4326 projection.
   * OpenLayers also treats coordinates in East-North order.
   *
   * @param location RecordedLocation to be converted.
   * @returns EPSG:3857 coordinates array in longitude:latitude order.
   */
  private RecordedLocationToCoordinates(location: RecordedLocation): number[] {
    return proj.transform(
      [location.longitude, location.latitude],
      'EPSG:4326',
      'EPSG:3857'
    );
  }
}
