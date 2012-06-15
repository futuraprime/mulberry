dojo.provide('toura.components.HideablePlaylist');
dojo.require('mulberry._Component');
dojo.require('toura.components.AudioList');

dojo.declare('toura.components.HideablePlaylist', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'HideablePlaylist/HideablePlaylist.haml'),

  widgetsInTemplate : true,

  commaStopper : undefined
});