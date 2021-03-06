const _ = require('lodash');

module.exports = {
  moogBundle: {
    modules: [ 'apostrophe-maintenance-mode-global' ],
    directory: './lib/modules'
  },
  construct: function(self, options) {
    self.exceptions = [
      '/login'
    ].concat(options.addExceptions || []);
    self.expressMiddleware = function(req, res, next) {
      const url = req.url.replace(/\?.*$/, '');
      if (_.includes(self.exceptions, url)) {
        return next();
      }
      if (req.method !== 'GET') {
        return next();
      }
      if (!req.data.global) {
        // We cannot make a determination. global module should load first though
        return next();
      }
      if (!req.data.global.maintenanceMode) {
        return next();
      }
      if (self.apos.permissions.can(req, 'admin')) {
        return next();
      }
      // 503 status code, most suitable for SEO
      // during maintenance mode per https://yoast.com/http-503-site-maintenance-seo/
      return res.status(503).send(self.render(req, 'message', {
        title: req.data.global.maintenanceTitle,
        message: req.data.global.maintenanceMessage
      }));
    };
    // Messages are subject to normal workflow, but the switch itself
    // automatically commits and exports
    self.on('apostrophe-docs:afterSave', 'autoCommitAndExport', async function(req, doc) {
      if (doc.type !== 'apostrophe-global') {
        return;
      }
      if (!doc.workflowGuid) {
        return;
      }
      await self.apos.docs.db.update({
        workflowGuid: doc.workflowGuid
      }, {
        $set: {
          maintenanceMode: doc.maintenanceMode
        }
      }, {
        multi: true
      });
    });
  }
};
