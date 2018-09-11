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
      title: rg_add_columns,
      icon: 'icon dashicons-text',
      onclick: function() {
        editor.windowManager.open({
          title: rg_columns,
          body: [{
            type: 'listbox',
            name: 'desktop_grid',
            label: rg_desktop,
            'values': colValues
          }, {
            type: 'listbox',
            name: 'tablet_grid',
            label: rg_tablet,
            'values': colValues
          }, {
            type: 'listbox',
            name: 'mobile_grid',
            label: rg_mobile,
            'values': colValues
          }, {
            type: 'textbox',
            name: 'content',
            label: rg_content,
            multiline: true,
            minWidth: 300,
            minHeight: 100,
          }, {
            type: 'checkbox',
            name: 'last',
            label: rg_last
          }],
          onsubmit: function(e) {
            editor.insertContent( '[rg_grid desktop_grid="' + e.data.desktop_grid + '" tablet_grid="' + e.data.tablet_grid +
              '" mobile_grid="' + e.data.mobile_grid + '" last="' + e.data.last + '"]' + e.data.content + '[/rg_grid]');
          }
        });
      }
    });
  });
})();
