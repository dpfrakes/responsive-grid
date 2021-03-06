(function() {

  var colValues = [
    {text: 'Full width', value: '12'},
    {text: '1/2 width', value: '6'},
    {text: '1/3 width', value: '4'},
    {text: '1/4 width', value: '3'}
  ];

  tinymce.PluginManager.add('rg_shortcodes_button', function(editor, url) {
    editor.addButton('rg_shortcodes_button', {
      title: rg_insert_grid,
      icon: 'icon dashicons-text',
      onclick: function() {
        editor.windowManager.open({
          title: rg_insert_grid,
          body: [{
            type: 'textbox',
            name: 'num_cols',
            label: rg_num_cols
          }, {
            type: 'listbox',
            name: 'desktop_grid',
            label: rg_desktop,
            values: colValues
          }, {
            type: 'listbox',
            name: 'tablet_grid',
            label: rg_tablet,
            values: colValues
          }, {
            type: 'listbox',
            name: 'mobile_grid',
            label: rg_mobile,
            values: colValues
          }],
          onsubmit: function(e) {
            htmlStr = '[rg_row]';
            for (var c = 0; c < parseInt(e.data.num_cols); c++) {
              htmlStr += '[rg_column desktop_grid="' + e.data.desktop_grid + '" tablet_grid="' + e.data.tablet_grid + '" mobile_grid="' + e.data.mobile_grid + '"]'
            }
            htmlStr += '[/rg_row]';
            editor.insertContent(htmlStr);
          }
        });
      }
    });

    function html(desktop, tablet, mobile) {
      return '<div class="rg-column' +
        (!!desktop ? ' col-lg-' + desktop : '') +
        (!!tablet ? ' col-md-' + tablet : '') +
        (!!mobile ? ' col-sm-' + mobile : '') + '"><p>&nbsp;</p></div>';
    }

    function shortcodeToHTML(content) {
      // Replace rows
      content = content.replace(/\[rg_row\]/g, '<div class="rg-grid"><div class="rg-row row">');
      content = content.replace(/\[\/rg_row\]/g, '</div></div><!--.rg-grid--><p>&nbsp;</p>');

      // Replace columns
      content = content.replace(/\[rg_column([^\]]*)\]/g, function(shortcodeStr) {
        var desktop = shortcodeStr.match(/desktop_grid="([^"]*)"/)[1];
        var tablet = shortcodeStr.match(/tablet_grid="([^"]*)"/)[1];
        var mobile = shortcodeStr.match(/mobile_grid="([^"]*)"/)[1];
        return html(desktop, tablet, mobile);
      });

      // Return final html
      return content;
    }

    editor.on('BeforeSetContent', function(event) {
      event.content = shortcodeToHTML(event.content);
    });

  });
})();
