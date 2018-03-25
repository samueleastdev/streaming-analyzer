class AbrStats {
  constructor(videoPlayer, wrapperElement) {
    this._videoPlayer = videoPlayer;

    this._wrapperElement = this._setupLayout(wrapperElement);
  }

  init() {
    return new Promise((resolve, reject) => {
      this._intervalId = setInterval(function() {
        this._updateStats();
      }.bind(this), 5000);

      this._updateStats();
      resolve();
    });
  }

  _updateStats() {
    const amd = this._videoPlayer.abrMetadata;
    if (amd && amd.stats) {
      let html = '';
      html += '<table class="metadata">';
      html += '<tr>';
      html += '<th>Downloaded Chunks</th>';
      html += '<th>Average Chunk Duration</th>';
      html += '<th>Average Chunk Size</th>';
      html += '<th>Average Chunk Load Time</th>';
      html += '<th>Average Chunk Bitrate</th>';
      html += '</tr>';
      html += '<tr>';
      html += `<td>${amd.stats.chunksDownloaded} chunks</td>`;
      html += `<td>${amd.stats.averageChunkDuration.toFixed(2)} sec</td>`;
      html += `<td>${amd.stats.averageChunkSizeKB.toFixed(2)} KB</td>`;
      html += `<td>${amd.stats.averageLoadTime.toFixed(2)} sec</td>`;
      html += `<td>${amd.stats.averageChunkBitrateKbps.toFixed(0)} Kbps</td>`;
      html += '</tr>';
      html += '</table>';
      this._wrapperElement.innerHTML = html;
      this._wrapperElement.className = 'analyzer-abrstats analyzer-abrstats-visible';
    }    
  }

  _setupLayout(wrapper) {
    const statsElement = document.createElement('div');
    statsElement.className = 'analyzer-abrstats analyzer-abrstats-hidden';
    statsElement.id = 'analyzer-abrstats';

    wrapper.appendChild(statsElement);
    return statsElement;
  }
}

module.exports = AbrStats;