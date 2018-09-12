(function() {

  var colValues = [
    {text: 'Full width', value: '12'},
    {text: '1/2 width', value: '6'},
    {text: '1/3 width', value: '4'},
    {text: '2/3 width', value: '8'},
    {text: '1/4 width', value: '3'},
    {text: '3/4 width', value: '9'},
    {text: '1/6 width', value: '2'},
    {text: '5/6 width', value: '10'},
    {text: '1/12 width', value: '1'},
    {text: '5/12 width', value: '5'},
    {text: '7/12 width', value: '7'},
    {text: '11/12 width', value: '11'}
  ];

  tinymce.PluginManager.add('rg_shortcodes_button', function( editor, url ) {
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
      return '<div class="' +
        (!!desktop ? 'col-md-' + desktop + ' ': '') +
        (!!tablet ? 'col-sm-' + tablet + ' ' : '') +
        (!!mobile ? 'col-xs-' + mobile : '') + '"><p></p></div>';
    }

    function replaceGridShortcodes(content) {
      // Replace rows
      content = content.replace(/\[rg_row\]/g, '<div class="rg-grid"><div class="row">');
      content = content.replace(/\[\/rg_row\]/g, '</div></div>');

      // Replace columns
      return content.replace(/\[rg_column([^\]]*)\]/g, function(shortcodeStr) {
        var desktop = shortcodeStr.match(/desktop_grid="([^"]*)"/)[1];
        var tablet = shortcodeStr.match(/tablet_grid="([^"]*)"/)[1];
        var mobile = shortcodeStr.match(/mobile_grid="([^"]*)"/)[1];
        return html(desktop, tablet, mobile);
      });
    }

    function restoreMediaShortcodes(content) {
      function getAttr(str, name) {
        name = new RegExp(name + '=\"([^\"]+)\"').exec(str);
        return name ? window.decodeURIComponent(name[1]) : '';
      }

      return content.replace(/rg_column/g, function(match, gridCol) {
        var data = getAttr(gridCol, 'desktop_grid');
        console.warn('desktop_grid attr val...');
        console.log(data);

        if (data) {
          return '<h3>' + data + '</h3>';
        }

        return match;
      });
    }

    editor.on('BeforeSetContent', function(event) {
      console.warn('BeforeSetContent');
      // console.log(editor.plugins.wpview);
      // console.log(typeof wp);
      // console.log(wp.mce);
      console.log(event);

      // if (!editor.plugins.wpview || typeof wp === 'undefined' || !wp.mce) {
        event.content = replaceGridShortcodes(event.content);
      // }
    });

    // editor.on('PostProcess', function(event) {
    //   console.warn('PostProcess');
    //   console.log(event.get);

    //   if (event.get) {
    //     event.content = restoreMediaShortcodes(event.content);
    //   }
    // });

  });
})();
