class AudioVisualizer {
  constructor(videoElement, wrapperElement) {
    this._videoElement = videoElement;
    this._wrapperElement = wrapperElement;
    this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  init() {
    return new Promise((resolve, reject) => {
      const canvasCtx = this._initCanvas();
      const source = this._audioContext.createMediaElementSource(this._videoElement);
      const analyser = this._audioContext.createAnalyser();
      source.connect(analyser);
      analyser.connect(this._audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);
      let drawViz;

      canvasCtx.clearRect(0, 0, this._width, this._height);
      const draw = function() {
        drawViz = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, this._width, this._height);

        const barWidth = (this._width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          canvasCtx.fillStyle = 'rgb(15,186,240)';
          canvasCtx.fillRect(x, this._height - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }
      }.bind(this);
      draw();
      resolve();
    });
  }

  _initCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'analyzer-audio-visualizer';
    canvas.className = 'analyzer-audio-visualizer';
    const intendedWidth = this._wrapperElement.clientWidth;
    canvas.setAttribute('width', intendedWidth);
    this._wrapperElement.appendChild(canvas);
    this._width = canvas.width;
    this._height = canvas.height;

    return canvas.getContext('2d');
  }
}

module.exports = AudioVisualizer;