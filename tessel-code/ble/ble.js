// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This Bluetooth Low Energy module demo scans
for nearby BLE peripherals. Much more fun if
you have some BLE peripherals around.
*********************************************/

var tessel = require('tessel');
var bleLib = require('ble-ble113a');
var bleadvertise = require('bleadvertise');

var ble = bleLib.use(tessel.port['A']);


var packet = {
  flags: [0x02, 0x04, 0x06], // Connectable, BLE only
  incompleteUUID128 : ['08c8c7a06cc511e3981f0800200c9a66'], // Tessel Firmware Version Service UUID
  shortName : 'Hey',
  serviceData: [{
        uuid: '08c8c7a06cc511e3981f0800200c9a66',
        data: 'hi'
    }],
  data: ['hi']
};

var ad = bleadvertise.serialize(packet);

var ble = bleLib.use(tessel.port['A'], function(){
  ble.setAdvertisingData(ad, function(){
    ble.startAdvertising();
    console.log('Now advertising');
    ble.startScanning();
  });
});


// ble.on('ready', function(err) {
//   console.log('Scanning...');
//   ble.startScanning();
// });

ble.on('discover', function(peripheral) {
  console.log("Discovered peripheral!", peripheral.toString());
  // if (peripheral.address.toString() === "203.19.37.240.237.202") {
  //   console.log("hi michelle?");
  //   ble.connect(peripheral, function(err) {
  //       console.log("error: ", err);
  //   });
  // }
});

ble.on('connect', function(master) {
    console.log("connected to: ", master.toString());
});

// ble.once('discover', function(master) {
//     ble.stopScanning(function(stopError) {
//       master.connect(function(connectError) {
//         callback && callback(master);
//       })
//     })
// });


