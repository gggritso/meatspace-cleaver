#!/usr/bin/env node
!( function() {

  'use strict';

  // IMPORTS
  var
    fs = require( 'fs' ),

    _ = require( 'underscore' ),
    _s = require( 'underscore.string' ),
    nomnom = require( 'nomnom' ),
    chalk = require( 'chalk' ),
    socket = require( 'socket.io-client' );

  // CONSTANTS
  var 
    fg = [ 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white' ],
    bg = _.map( fg, function( d ) { return 'bg' + _s.capitalize( d ); });

  var
    OPEN_MESSAGES = [ 'Meating Intensifies!', 'FOMO be gone!', 'Oh boy, I hope my secret crush is online!' ],
    CLOSE_MESSAGES = [ 'Brace for FOMO!', 'FOMO DEFCON 2', 'Oh God, what have you done!?', 'They’ll miss you though!', '<3' ],
    NAMES;

  try {
    NAMES = JSON.parse( fs.readFileSync( process.env['HOME']  + '/.meatspace-cleaver-names.json' ) );
  } catch ( err ) {
    NAMES = {};
  }

  // STATE
  var 
    mapping = {},
    combinations = [];

  // HELPERS
  var colourFromFingerPrint = function ( fingerprint ) {
    // For a while I wanted to highlight different names with different colours but quickly realized that terminals don't support enough of them. Oh well! I'll leave this for the future.

    d = mapping[ fingerprint ];
    if ( d ) {
      var d = mapping[ fingerprint ];
      return chalk[ d[0] ][ d[1] ];
    }

    var cfg, cbg, retries = 0;

    do {

      cfg = _.sample( fg, 1 )[ 0 ];
      cbg = _.sample( bg, 1 )[ 0 ];
      retries += 1;

    } while ( _.contains( combinations, cfg + cbg ) && retries < 5 );
    // TODO: make sure that BG and FG are different colours ... and don't look terrible

    combinations.push( cfg + cbg );
    mapping[ fingerprint ] = [ cfg, cbg ];

    return chalk[ cfg ][ cbg ];

  };

  var nameFromFingerPrint = function ( fingerprint ) {
    return NAMES[ fingerprint ] || fingerprint;
  };

  var trimFingerprint = function ( fingerprint ) {
    return fingerprint.slice( 0, 7 ) + '...' + fingerprint.slice( -7, fingerprint.length ) + ':';
  };

  var respondToMessage = function ( message ) {
    var
      fingerprint = message.chat.value.fingerprint,
      message = message.chat.value.message,
      name = nameFromFingerPrint( fingerprint ),
      infix = ':';

    console.log( chalk.magenta( nameFromFingerPrint( fingerprint ) + infix ), message );

  };

  var respondToDisconnect = function() {
    console.log( chalk.red( 'lost connection :(' ) );
    process.exit();
  };

  var respondToExit = function() {
    console.log( chalk.red( _.sample( CLOSE_MESSAGES, 1 )[0] ) );
    process.exit();
  };

  // PROCESS HOOKS
  process.on( 'SIGINT', respondToExit );

  // PARAMETERS
  var options = nomnom
    .option( 'channel', {
      'abbr': 'c', 'default': 'chat',
      'help': 'which subdomain to connect to, chat, fr or es'
    })
    .parse();

  var URL = 'https://' + options.channel + '.meatspac.es/';
  var c = socket.connect( URL ).on( 'connect', function() {
    console.log( chalk.red( _.sample( OPEN_MESSAGES, 1 )[0] ) );
    c.on( 'message', respondToMessage );
    c.on( 'disconnect', respondToDisconnect );
  });

})();
