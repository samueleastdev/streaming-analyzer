class Metadata {
  constructor(videoPlayer, wrapperElement) {
    this._videoPlayer = videoPlayer;

    this._wrapperElement = this._setupLayout(wrapperElement);
  }

  init() {
    return new Promise((resolve, reject) => {
      this._intervalId = setInterval(function() {
        this._updateMetadata();
      }.bind(this), 5000);

      this._updateMetadata();
      resolve();
    });
  }

  _updateMetadata() {
    const md = this._videoPlayer.codecMetadata;
    const amd = this._videoPlayer.abrMetadata;

    if (md) {
      let html = '<h2>MediaSource Buffer</h2>';
      html += '<table class="metadata">';
      html += '<tr><th>VIDEO</th><th>AUDIO</th></tr>';
      html += `<tr><td>${md.video.container}</td><td>${md.audio.container}</td></tr>`;
      html += `<tr><td>${md.video.codec}</td><td>${md.audio.codec}</td></tr>`;
      html += `<tr><td>${md.video.resolution}</td><td>${md.audio.channels} channel(s)</td></tr>`;
      html += '</table>';

      if (amd) {
        html += '<h2>Available Levels</h2>';
        html += '<table class="metadata">';
        html += '<tr><th>RESOLUTION</th><th>BITRATE</th><th>VIDEO</th><th>AUDIO</th></tr>';
        amd.availableLevels.forEach(l => {
          html += `<tr><td>${l.resolution}</td><td>${l.bitrate}bps</td><td>${l.videoCodec}</td><td>${l.audioCodec}</td></tr>`;
        });
        html += '</table>';        
      }
      this._wrapperElement.innerHTML = html;
      this._wrapperElement.className = 'analyzer-metadata analyzer-metadata-visible';
    }
  }

  _setupLayout(wrapper) {
    const metadataElement = document.createElement('div');
    metadataElement.className = 'analyzer-metadata analyzer-metadata-hidden';
    metadataElement.id = 'analyzer-metadata';

    wrapper.appendChild(metadataElement);
    return metadataElement;
  }
}

module.exports = Metadata;