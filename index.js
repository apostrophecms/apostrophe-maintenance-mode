const _ = require('lodash');

module.exports = {
  moogBundle: {
    modules: [ 'apostrophe-maintenance-mode-global' ],
    directory: './lib/modules'
  },
  construct: function(self, options) {
    self.onlySelected = [];
    self.exceptions = [
      '/login'
    ].concat(options.addExceptions || []);
    self.expressMiddleware = function(req, res, next) {
      const url = req.url.replace(/\?.*$/, '');
      const onlySelected = req.data.global.maintenanceOnlySelected;

      if (onlySelected){
        self.onlySelected = onlySelected.map( function(obj) { return obj.page; } );
      }

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
      }else {
        if (self.onlySelected.length && _.includes(self.onlySelected, url)) {
          return res.status(503).send(self.render(req, 'message', {
            title: req.data.global.maintenanceTitle,
            message: req.data.global.maintenanceMessage
          }));
        }else {
          return next();
        }
      }
      if (self.apos.permissions.can(req, 'admin')) {
        return next();
      }
      return res.status(503).send(self.render(req, 'message', {
        title: req.data.global.maintenanceTitle,
        message: req.data.global.maintenanceMessage
      }));
        // 503 status code, most suitable for SEO
        // during maintenance mode per https://yoast.com/http-503-site-maintenance-seo/
       
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
