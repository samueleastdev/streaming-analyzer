class AbrVisualizer {
  constructor(videoElement, wrapperElement, videoPlayer) {
    this._videoElement = videoElement;
    this._wrapperElement = wrapperElement;
    this._videoPlayer = videoPlayer;
  }

  init() {
    return new Promise((resolve, reject) => {
      const canvasCtx = this._initCanvas();
      let drawViz;

      canvasCtx.clearRect(0, 0, this._width, this._height);

      const draw = function() {
        drawViz = requestAnimationFrame(draw);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, this._width, this._height);
        const timeSeries = this._videoPlayer.abrTimeSeriesData;
        const abrMetadata = this._videoPlayer.abrMetadata;
        if (timeSeries.length > 0) {
          const maxSegmentDuration = 11;
          const maxSize = 6000000;
          const maxBarWidth = (this._width / timeSeries[0].timeSeriesBufferSize);
          const maxBarHeight = (this._height / timeSeries[0].levelBucketCount);

          for (let i = 0; i < timeSeries[0].levelBucketCount; i++) {
            const level = abrMetadata.availableLevels[i];
            canvasCtx.strokeStyle = 'rgb(255,255,255)';
            canvasCtx.strokeRect(1, i * maxBarHeight, this._width-1, maxBarHeight);
            canvasCtx.font = "8pt LevelOne";
            canvasCtx.fillStyle = 'rgb(255,255,255)';
            canvasCtx.fillText(level.resolution, this._width - 50, ((i+1) * maxBarHeight) - 5);
          }

          let x = 0;
          let y = 0;

          for (let i = 0; i < timeSeries.length; i++) {
            const d = timeSeries[i];
            x = i * maxBarWidth;
            y = maxBarHeight * d.levelBucket;
            const maxLoadTime = d.durationSec * 1000;
            const r = Math.floor((d.loadTimeMs / maxLoadTime) * 255);
            const g = 255 - r;
            const c = `rgb(${r},${g},0)`;
            canvasCtx.fillStyle = c;
            //console.log(x, y, (d.durationSec / maxSegmentDuration) * maxBarWidth, (d.sizeBytes / maxSize) * maxBarHeight);
            canvasCtx.fillRect(x, y, (d.durationSec / maxSegmentDuration) * maxBarWidth, (d.sizeBytes / maxSize) * maxBarHeight);
          }
        }
      }.bind(this);
      draw();
      resolve();
    });
  }

  _initCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'analyzer-abr-visualizer';
    canvas.className = 'analyzer-abr-visualizer';
    const intendedWidth = this._wrapperElement.clientWidth;
    canvas.setAttribute('width', intendedWidth);
    this._wrapperElement.appendChild(canvas);
    this._width = canvas.width;
    this._height = canvas.height;

    return canvas.getContext('2d');

  }
}

module.exports = AbrVisualizer;