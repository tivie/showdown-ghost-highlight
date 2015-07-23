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
    {
      type: 'html',
      extract: 'all',
      filter: function (text) {
        var highlightRegex = /\b(=){2}([\s\S]+?)(=){2}\b/g;

        text = text.replace(highlightRegex, function (match, n, content) {
          // Check the content isn't just an `=`
          if (!/^ ?=+ ?$/.test(content)) {
            return '<mark>' + content + '</mark>';
          }

          return match;
        });

        return text;
      }
    },
    {
      // Escaped equals
      type: 'html',
      regex: '\\\\(=)',
      replace: function (match, content) {
        return content;
      }
    }
  ];

}));
