var Location = require('../models/location.js')
  , Person = require('../models/person.js')
  , Definition = require('../models/definition.js') 
  , express = require('express')
  , _ = require('underscore')
  , GoogleSpreadsheets = require("google-spreadsheets")
  , importer = express.Router();

var importPrisonLocations = function(req, res, next) {
  GoogleSpreadsheets({
    key: "1Wf3Zwhj_5cNaTUKNqayHrqiKgxpelfAOS7Nek77lgQE"
  }, function(err, spreadsheet) {
      spreadsheet.worksheets[3].cells({
          ///range: "R1C1:R5C5"
      }, function(err, result) {
        var locations = [];
        _.each(result.cells, function(row, key) {
          if( key != '1' && row.hasOwnProperty(8)) {
            var prison = {
              type: 'prison',
              name: '',
              synonyms: [],
              prison_type: '',
              nearest_locality: '',
              country: '',
              description: '',
              point: []
            }
            if(row.hasOwnProperty(1)) prison.name = row[1].value;
            if(row.hasOwnProperty(2)) prison.synonyms = prison.synonyms.concat(row[2].value.split(','));
            if(row.hasOwnProperty(3)) prison.synonyms = prison.synonyms.concat(row[3].value.split(','));
            if(row.hasOwnProperty(4)) prison.prison_type = row[4].value;
            if(row.hasOwnProperty(5)) prison.nearest_locality = row[5].value;
            if(row.hasOwnProperty(7)) prison.point = row[7].value.split(',');
            if(row.hasOwnProperty(8)) prison.country = row[8].value;
            if(row.hasOwnProperty(9)) prison.description = row[9].value;
            locations.push(prison);
          }
        });
        Location.create(locations, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send(err.stack);
          } else {
            res.status(200).send(locations.length + ' locations have been imported!');
          }
        });
      });
  });
}

var importToponymLocations = function(req, res, next) {
  GoogleSpreadsheets({
    key: "1Wf3Zwhj_5cNaTUKNqayHrqiKgxpelfAOS7Nek77lgQE"
  }, function(err, spreadsheet) {
      spreadsheet.worksheets[2].cells({
          ///range: "R1C1:R5C5"
      }, function(err, result) {
        var locations = [];
        _.each(result.cells, function(row, key) {
          if( key != '1' && row.hasOwnProperty(5)) {
            var toponym = {
              type: 'toponym',
              name: '',
              synonyms: [],
              current_name: '',
              country: '',
              description: '',
              point: []
            }
            if(row.hasOwnProperty(1)) toponym.name = row[1].value;
            if(row.hasOwnProperty(2)) toponym.synonyms = toponym.synonyms.concat(row[2].value.split(','));
            if(row.hasOwnProperty(3)) toponym.synonyms = toponym.synonyms.concat(row[3].value.split(','));
            if(row.hasOwnProperty(6)) toponym.synonyms = toponym.synonyms.concat(row[6].value.split(','));
            if(row.hasOwnProperty(3)) toponym.current_name = row[3].value;
            if(row.hasOwnProperty(4)) toponym.point = row[4].value.split(',');
            if(row.hasOwnProperty(5)) toponym.country = row[5].value;
            if(row.hasOwnProperty(8)) toponym.description = row[8].value;
            locations.push(toponym);
          }
        });
        Location.create(locations, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send(err.stack);
          } else {
            res.status(200).send(locations.length + ' locations have been imported!');
          }
        });
      });
  });
}

importer.route('/locations/prisons')
  .get(importPrisonLocations)

importer.route('/locations/toponyms')
  .get(importToponymLocations)

var importPersons = function(req, res, next) {
  GoogleSpreadsheets({
    key: "1Wf3Zwhj_5cNaTUKNqayHrqiKgxpelfAOS7Nek77lgQE"
  }, function(err, spreadsheet) {
      spreadsheet.worksheets[6].cells({
          ///range: "R1C1:R5C5"
      }, function(err, result) {
        var persons = [];
        _.each(result.cells, function(row, key) {
          if( key != '1' && row.hasOwnProperty(1)) {
            var person = {
              name: row[1].value,
              description: ''
            }
            if(row.hasOwnProperty(1)) person.name = row[1].value;
            if(row.hasOwnProperty(3)) person.description = row[3].value;

            persons.push(person);
          }
        });
        Person.create(persons, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send(err.stack);
          } else {
            res.status(200).send(persons.length + ' persons have been imported!');
          }
        });
      });
  });
}

importer.route('/persons')
  .get(importPersons)


var importDefinitions = function(req, res, next) {
  GoogleSpreadsheets({
    key: "1Wf3Zwhj_5cNaTUKNqayHrqiKgxpelfAOS7Nek77lgQE"
  }, function(err, spreadsheet) {
      spreadsheet.worksheets[4].cells({
          ///range: "R1C1:R5C5"
      }, function(err, result) {
        var definitions = [];
        _.each(result.cells, function(row, key) {
          if( key != '1' && row.hasOwnProperty(1)) {
            var definition = {
              title: row[1].value,
              description: ''
            }
            if(row.hasOwnProperty(1)) definition.title = row[1].value;
            if(row.hasOwnProperty(3)) definition.description = row[3].value;

            definitions.push(definition);
          }
        });
        Definition.create(definitions, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send(err.stack);
          } else {
            res.status(200).send(definitions.length + ' definitions have been imported!');
          }
        });
      });
  });
}

var importDefinitionsAdditional = function(req, res, next) {
  GoogleSpreadsheets({
    key: "1Wf3Zwhj_5cNaTUKNqayHrqiKgxpelfAOS7Nek77lgQE"
  }, function(err, spreadsheet) {
      spreadsheet.worksheets[5].cells({
          ///range: "R1C1:R5C5"
      }, function(err, result) {
        var definitions = [];
        _.each(result.cells, function(row, key) {
          if( key != '1' && row.hasOwnProperty(1)) {
            var definition = {
              title: row[1].value,
              description: ''
            }
            if(row.hasOwnProperty(1)) definition.title = row[1].value;
            if(row.hasOwnProperty(3)) definition.description = row[3].value;

            definitions.push(definition);
          }
        });
        Definition.create(definitions, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send(err.stack);
          } else {
            res.status(200).send(definitions.length + ' definitions have been imported!');
          }
        });
      });
  });
}

importer.route('/definitions/abr')
  .get(importDefinitions)

importer.route('/definitions/jargon')
  .get(importDefinitionsAdditional)

module.exports = importer;