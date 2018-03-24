const request = require('request');
const Hls = require('hls.js');

const ENUM_TYPE_HLS = 'HLS';
const ENUM_TYPE_MPEGDASH = 'MPD';

const TIME_SERIES_BUFFER_SIZE = 20;

const CONTENT_TYPE_MAP = {
  'application/x-mpegURL': ENUM_TYPE_HLS,
};

class VideoPlayer {
  constructor(videoElement, uri) {
    this._uri = uri;
    this._videoElement = videoElement;
    this._codecMetadata;
    this._abrMetadata;
    this._abrTimeSeries = [];
    this._levelBucketCount = 0;
  }

  init() {
    return new Promise((resolve, reject) => {
      this._determineType(this._uri).then(type => {
        let playerPromise;
        this._playerTechType = type;
        if (this._playerTechType === ENUM_TYPE_HLS) {
          playerPromise = this._initiateHlsPlayer();
        } else {
          reject(`No player tech available for type '${type}'`);
        }
        return playerPromise;
      }).then(() => {
        resolve();
      }).catch(reject);
    });
  }

  get codecMetadata() {
    return this._codecMetadata;
  }

  get abrMetadata() {
    return this._abrMetadata;
  }

  get abrTimeSeriesData() {
    return this._abrTimeSeries;
  }

  _initiateHlsPlayer() {
    return new Promise((resolve, reject) => {
      const hls = new Hls();
      hls.attachMedia(this._videoElement);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(this._uri);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log(data);
        this._videoElement.play();

        let availableLevels = [];
        data.levels.forEach(l => {
          availableLevels.push({
            bitrate: l.bitrate,
            resolution: l.width + 'x' + l.height,
            videoCodec: l.videoCodec,
            audioCodec: l.audioCodec,
          });
        });
        this._levelBucketCount = availableLevels.length;
        this._abrMetadata = {
          availableLevels,
        };
        resolve();
      });
      hls.on(Hls.Events.BUFFER_CODECS, (event, data) => {
        console.log(data);
        this._codecMetadata = {
          audio: {
            container: data.audio.container,
            codec: data.audio.codec,
            channels: data.audio.metadata.channelCount,
          },
          video: {
            container: data.video.container,
            codec: data.video.codec,
            resolution: data.video.metadata.width + 'x' + data.video.metadata.height,
          },
        };
      });
      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        //console.log(data);
        this._pushAbrTimeSeriesData({
          levelBucket: data.frag.level,
          levelBucketCount: this._levelBucketCount,
          loadTimeMs: data.stats.tload - data.stats.trequest,
          sizeBytes: data.stats.total,
          durationSec: data.frag.duration,
        });
      });
      this._playerTech = hls;
    });
  }

  _pushAbrTimeSeriesData(d) {
    d.timeSeriesBufferSize = TIME_SERIES_BUFFER_SIZE;
    this._abrTimeSeries.push(d);
    if (this._abrTimeSeries.length > TIME_SERIES_BUFFER_SIZE) {
      this._abrTimeSeries.shift();
    }
  }

  _determineType(uri) {
    return new Promise((resolve, reject) => {
      request(uri, (err, resp, body) => {
        const type = CONTENT_TYPE_MAP[resp.headers['content-type']];
        if (!type) {
          reject(`Unsupported content '${resp.headers['content-type']}'`);
        } else {
          resolve(type);
        }
      });
    });
  }
}

module.exports = VideoPlayer;