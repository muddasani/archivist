var util = require('../api/utils.js')
  , indexQueue = require('./queue.js')
  , express = require('express')
  , _ = require('underscore')
  , maintenance = {};

/** 
 * Start a new transaction for batch document operations
 *
 * @param {callback} cb - The callback that handles the results 
 */

maintenance.beginTransaction = function(cb) {
  indexQueue.pause();
  console.log('beginning transaction ...');
  // turn on maintenance mode
  maintenance.setMaintenanceMode(true, function(err) {
    if (err) return cb(err);

    maintenance.backupDocuments(cb);
  });
}

/** 
 * Cancel transaction to roll back document updates
 *
 * @param {callback} cb - The callback that handles the results 
 */

maintenance.cancelTransaction = function(cb) {
  // Switch off maintenance mode after successful completion
  console.log('canceling transaction... rolling back document updates');
  maintenance.restoreDocuments(function(err) {
    if (err) return err;
    indexQueue.resume();
    maintenance.setMaintenanceMode(false, cb);
  });
}

/** 
 * Commit transaction by turning off maintenance mode
 *
 * @param {callback} cb - The callback that handles the results 
 */ 

maintenance.commitTransaction = function(cb) {
  console.log('commiting transaction...');
  indexQueue.resume();
  maintenance.setMaintenanceMode(false, cb);
}

/**
 * Turn maintenance mode on or off
 *
 * @param {boolean} on - true if maintenance mode should be turned on
 * @param {callback} cb - The callback when backup job is done
 * 
 * Note: we don't need a userId anymore for implicit maintenance mode
 */

maintenance.setMaintenanceMode = function(on, cb) {
  try {
    var data = {
      on: on
    };
    
    util.setSystemVariable('maintenance', data, cb);
  } catch (e) {
    cb(err);
  }
}

/**
 * Create a backup copy of changed documents
 *
 * @param {callback} cb - The callback when backup job is done
 */

maintenance.backupDocuments = function(cb) {
  var Document = require('../../models/document.js');
  Document.backup(cb);
}

/**
 * Restore from a previous backup snapshot
 *
 * @param {callback} cb - The callback when backup job is done
 */

maintenance.restoreDocuments = function(cb) {
  var Document = require('../../models/document.js');
  Document.restore(cb);
}

// Checks whether or not system is in maintenance mode

maintenance.checkCurrentMode = function(req, res, next) {
  util.getSystemVariable('maintenance', function(err, mode) {
    if (err) return next(err);
    mode = mode.toJSON();
    if (!mode.on) {
      return next();
    } else {
      res.status(503);
      res.send('System is in maintenance mode, please try again later');
    }
  })
}

module.exports = maintenance;