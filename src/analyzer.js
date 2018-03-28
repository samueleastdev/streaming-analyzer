const InputDlg = require('./input_dlg.js');
const ErrorDlg = require('./error_dlg.js');
const VideoPlayer = require('./video_player.js');
const AudioVisualizer = require('./audio_visualizer.js');
const AbrVisualizer = require('./abr_visualizer.js');
const AbrStats = require('./abr_stats.js');
const Metadata = require('./metadata.js');

const TITLE = 'Streaming Analyzer';

class Analyzer {
  constructor(wrapperId) {
    this._wrapperElement = this._initWrapper(wrapperId);
    this._inputDlg = new InputDlg();
    this._wrapperElement.appendChild(this._inputDlg.wrapper);
    this._errorDlg = new ErrorDlg();
    this._wrapperElement.appendChild(this._errorDlg.wrapper);
  }

  start() {
    return new Promise((resolve, reject) => {
      this._inputDlg.onClose = function(uri) {
        const videoElement = document.getElementById('analyzer-video');
        const overlayElement = document.getElementById('analyzer-overlay');

        this._videoPlayer = new VideoPlayer(videoElement, uri);
        this._videoPlayer.init().then(() => {
          overlayElement.className = 'analyzer-overlay analyzer-overlay-visible';
          const audioViz = new AudioVisualizer(videoElement, overlayElement);
          console.log('Initializing audio visualizer');
          return audioViz.init();
        }).then(() => {
          const techMetadata = new Metadata(this._videoPlayer, overlayElement);
          return techMetadata.init();
        }).then(() => {
          const abrStats = new AbrStats(this._videoPlayer, overlayElement);
          return abrStats.init();
        }).then(() => {
          const abrViz = new AbrVisualizer(videoElement, overlayElement, this._videoPlayer);
          console.log('Initializing ABR visualizer');
          return abrViz.init();
        }).then(() => {
          resolve();
        })
        .catch(errmsg => {
          this._handleError(errmsg);
        });
      }.bind(this);
    });
  }

  _handleError(msg) {
    console.error(msg);
    this._errorDlg.message = msg;
    this._errorDlg.show();
  }

  _initWrapper(wrapperId) {
    const wrapperElement = document.getElementById(wrapperId);
    wrapperElement.className = 'analyzer-wrapper';

    const videoElement = document.createElement('video');
    videoElement.className = 'analyzer-video';
    videoElement.id = 'analyzer-video';
    wrapperElement.appendChild(videoElement);

    const overlayElement = document.createElement('div');
    overlayElement.className = 'analyzer-overlay analyzer-overlay-hidden';
    overlayElement.id = 'analyzer-overlay';

    wrapperElement.addEventListener('click', ev => {
      const t = document.getElementById('analyzer-overlay');
      if (t.className.match(/hidden/)) {
        t.className = 'analyzer-overlay analyzer-overlay-visible';
      } else {
        t.className = 'analyzer-overlay analyzer-overlay-hidden';        
      }
    });

    const overlayBranding = document.createElement('div');
    overlayBranding.className = 'analyzer-overlay-branding';
    const logo = document.createElement('div');
    logo.className = 'analyzer-overlay-branding-logo';
    overlayBranding.appendChild(logo);
    const title = document.createElement('div');
    title.className = 'analyzer-overlay-branding-title';
    title.innerHTML = TITLE;
    overlayBranding.appendChild(title);

    overlayElement.appendChild(overlayBranding);

    const overlayLegend = document.createElement('div');
    overlayLegend.className = 'analyzer-overlay-legend';
    let htmlLegend = '';
    htmlLegend += '<p>Developed by <a href="http://www.eyevinntechnology.se">Eyevinn Technology</a> and built on <a href="https://github.com/video-dev/hls.js">hls.js</a>. Report issues <a href="https://github.com/Eyevinn/streaming-analyzer/issues">here</a>. ';
    htmlLegend += 'Click on window to hide Analyzer</p>';
    overlayLegend.innerHTML = htmlLegend;

    overlayElement.appendChild(overlayLegend);
    wrapperElement.appendChild(overlayElement);
  
    return wrapperElement;
  }
}

module.exports = Analyzer;