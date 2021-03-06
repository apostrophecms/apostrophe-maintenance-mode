module.exports = {
  improve: 'apostrophe-global',
  construct: function(self, options) {
    options.addFields = (options.addFields || []).concat([
      {
        type: 'boolean',
        name: 'maintenanceMode',
        label: 'Maintenance Mode',
        help: 'While the site is in maintenance mode, a special message is displayed and no pages can be accessed, except by admins. You can still log in as an admin by accessing /login.',
        permission: 'admin'
      },
      {
        type: 'string',
        name: 'maintenanceTitle',
        label: 'Maintenance Page Title',
        help: 'Page title displayed while the site is in maintenance mode.',
        permission: 'admin'
      },
      {
        type: 'string',
        textarea: true,
        name: 'maintenanceMessage',
        label: 'Maintenance Page Message',
        help: 'Text displayed while the site is in maintenance mode.',
        permission: 'admin'
      }
    ]);
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'maintenance',
        label: 'Maintenance',
        fields: [ 'maintenanceMode', 'maintenanceTitle', 'maintenanceMessage' ]
      }
    ]);
  }
};
