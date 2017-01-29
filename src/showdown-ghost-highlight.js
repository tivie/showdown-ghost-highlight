/* jshint node:true, browser:true */

// Ghost Image Preview
//
// Manages the conversion of image markdown `![]()` from markdown into the HTML image preview
// This provides a dropzone and other interface elements for adding images
// Is only used in the admin client.
(function (extension) {
  'use strict';

  if (typeof showdown === 'object') {
    // global (browser or nodejs global)
    showdown.extension('highlight', extension());
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define('highlight', extension());
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension();
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function() {
  return [
    // Handle escaped =
    {
      type: 'lang',
      regex: /\\=/g,
      replace: function (match) {
        return '¨E' + match.charCodeAt(1) + 'E';
      }
    },
    // Adds highlight syntax as per RedCarpet:
    //
    // https://github.com/vmg/redcarpet
    //
    // This is ==highlighted==. It looks like this: <mark>highlighted</mark>
    //
    // Is only called on span gamut, after italics and bold are parsed,
    // so words can be highlighted and bolded
    {
      type: 'listener',
      listeners: {
        'italicsAndBold.after': function (evtName, text) {
          text = text.replace(/(^|\s|>|\b)==(?=\S)([\s\S]+?)==(?=\b|<|\s|$)/gm, function (match, p, content) {
            return p + '<mark>' + content + '</mark>';
          });
          return text;
        }
      }
    }
  ];

}));
