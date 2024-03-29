// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This camera example takes a picture. If a
directory is specified with the --upload-dir
flag, the picture is saved to that directory.
*********************************************/

var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['B']);
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['D']);
var fs = require('fs');
// fs.writeFileSync('temp.txt', 'hi');
console.log(__dirname + '/temp.txt');
fs.writeFile(__dirname + '/temp.txt', 'Hello Node', function (err) {
  if (err) {
    throw err;
    console.log('err: ', err);
  } else {
    console.log('It\'s saved!');
  }
});

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture
camera.setResolution( 'vga', function(err) { console.log(err); } );
// Wait for the camera module to say it's ready
camera.on('ready', function() {
  notificationLED.high();
  // Take the picture
  camera.takePicture(function(err, image) {
    if (err) {
      console.log('error taking image', err);
    } else {
      notificationLED.low();
      // Name the image
      var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
      // Save the image
      console.log('Picture saving as', name, '...');
      
      climate.readTemperature('f', function (err, temp) {
        climate.readHumidity(function (err, humid) {
          var temp = 'Degrees:' + temp.toFixed(4) + 'F' + 'Humidity:' + humid.toFixed(4) + '%RH';
          console.log(temp);
          // fs.writeFileSync('./camera/temp.txt', 'hi');
        });
      });
      
      process.sendfile(name, image);
      console.log('done.');
      // Turn the camera off to end the script
      camera.disable();
    }
  });
});

camera.on('error', function(err) {
  console.error(err);
});