'use strict';
const test = require('mapbox-gl-js-test').test;
const VectorTileSource = require('../../../../js/source/vector_tile_source');
const window = require('../../../../js/util/window');
const Map = require('../../../../js/ui/map');

function createMap(logoPosition, logoRequired) {
    const container = window.document.createElement('div');
    return new Map({
        container: container,
        style: {
            version: 8,
            sources: {
                'composite': createSource({
                    minzoom: 1,
                    maxzoom: 10,
                    attribution: "Mapbox",
                    tiles: [
                        "http://example.com/{z}/{x}/{y}.png"
                    ]
                }, logoRequired)
            },
            layers: []
        },
        logoPosition: logoPosition || undefined
    });
}

function createSource(options, logoRequired) {
    const source = new VectorTileSource('id', options, { send: function () {} });
    source.onAdd({
        transform: { angle: 0, pitch: 0, showCollisionBoxes: false }
    });
    source.on('error', (e) => {
        throw e.error;
    });
    const logoFlag = "mapbox_logo";
    source[logoFlag] = logoRequired === undefined ? true : logoRequired;
    return source;
}
test('LogoControl appears in bottom-left by default', (t) => {
    const map = createMap();
    map.on('load', () => {
        t.equal(map.getContainer().querySelectorAll(
            '.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-logo'
        ).length, 1);
        t.end();
    });
});
test('LogoControl appears in the position specified by the position option', (t) => {
    const map = createMap('top-left');
    map.on('load', () => {
        t.equal(map.getContainer().querySelectorAll(
            '.mapboxgl-ctrl-top-left .mapboxgl-ctrl-logo'
        ).length, 1);
        t.end();
    });
});
test('LogoControl is not added when the mapbox_logo property is false', (t) => {
    const map = createMap('top-left', false);
    map.on('load', () => {
        t.equal(map.getContainer().querySelectorAll(
                '.mapboxgl-ctrl-top-left .mapboxgl-ctrl-logo').length,
            0);
        t.end();
    });
});
