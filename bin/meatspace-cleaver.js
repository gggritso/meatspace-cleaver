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
    ADJECTIVES = [ 'pan-fried', 'braised', 'boiled', 'grilled', 'baked', 'skewered', 'sous-vide', 'poached', 'BBQ', 'rare', 'seared', 'steamed', 'raw', 'sautéed', 'simmered', 'deep-fried' ],
    MEATS = [ 'chicken', 'salmon', 'beef', 'horse', 'pork', 'quail', 'veal', 'shrimp', 'cod', 'kangaroo', 'camel', 'bison', 'lamb', 'turkey', 'squid', 'pheasant' ],
    CUTS = [ 'fillet', 'steak', 'medallion', 'tongue', 'tar-tar', 'sushi', 'stew', 'tenderloin', 'giblets', 'neck', 'soup', 'sandwich', 'wrap', 'in a bread bowl', 'paté', 'dip' ];
  var
    OPEN_MESSAGES = [ 'Meating Intensifies!', 'FOMO be gone!', 'Oh boy, I hope my secret crush is online!', 'Goodbye, hopes of being productive today!', 'I wonder if they’re talking about dildo knives again...' ],
    CLOSE_MESSAGES = [ 'Brace for FOMO!', 'FOMO DEFCON 2', 'Oh God, what have you done!?', '<3 <3 <3', 'You’ll come crawling back. They all do.', 'I give it like five minutes, tops.' ];

  // STATE
  var 
    previousFingerprint = '';

  // HELPERS
  var makeSpaces = function ( len ) {
    var retA = [];
    for (var i = 0; i < len; i++ ) {
      retA.push( ' ' );
    }

    return retA.join( '' );
  };

  var integerFromHex = function ( c ) {
    return parseInt( c, 16 );
  };

  var nameFromFingerPrint = function ( fingerprint ) {
    var
      t = _.map( fingerprint.split( '' ).slice( 0, 3 ), integerFromHex ),
      processedName = ADJECTIVES[ t[ 0 ] ] + ' ' + MEATS[ t[ 1 ] ] + ' ' + CUTS[ t[ 2 ] ];

    if ( fingerprint === previousFingerprint ) {
      processedName = makeSpaces( processedName.length );
    }

    previousFingerprint = fingerprint;
    return processedName;
  };

  var respondToMessage = function ( message ) {
    var
      fingerprint = message.chat.value.fingerprint,
      message = message.chat.value.message,
      infix = ':',
      nom = nameFromFingerPrint( fingerprint ) + infix;

    console.log( chalk[ 'magenta' ]( nom ), message );
  };

  var respondToDisconnect = function () {
    console.log( chalk.red( 'lost connection :(' ) );
    process.exit();
  };

  var respondToExit = function() {
    console.log( '\r  ' );
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
