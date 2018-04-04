const EXAMPLE_ASSETS = [
  { name: 'Jan Ozer at STSWE17 (HLS, long)', uri: 'https://maitv-vod.lab.eyevinn.technology/stswe17-ozer.mp4/master.m3u8' },
  { name: 'VINN showreel (HLS, short)', uri: 'https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8' },
  { name: 'Eyevinn Channel Engine (HLS, live)', uri: 'https://ott-channel-engine.herokuapp.com/live/master.m3u8' },
  { name: 'Angel One (MPEG-DASH)', uri: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd' },
  { name: 'Sintel 4k (MPEG-DASH)', uri: 'https://storage.googleapis.com/shaka-demo-assets/sintel-mp4-only/dash.mpd' },
  { name: 'Test Picture (MPEG-DASH, live)', uri: 'https://vm2.dashif.org/livesim/mup_30/testpic_2s/Manifest.mpd' },
  { name: 'ARD (MPEG-DASH, live)', uri: 'https://irtdashreference-i.akamaihd.net/dash/live/901161/bfs/manifestARD.mpd' },
];

class InputDlg {
  constructor() {
    this._wrapperElement = this._initInputDlg();
  }

  set onClose(fn) {
    this._onCloseFunction = fn;
  }

  get wrapper() {
    return this._wrapperElement;
  }

  get value() {
    const inputElement = this._wrapperElement.getElementsByClassName('analyzer-input-form-uri');
    return inputElement.uri.value;
  }


  _initInputDlg() {
    const dlgElement = document.createElement('div');
    dlgElement.className = 'analyzer-dlg analyzer-dlg-show';
    dlgElement.id = 'analyzer-input';
    const formElement = document.createElement('form');
    formElement.className = 'analyzer-input-form';
    const inputElement = document.createElement('input');
    inputElement.className = 'analyzer-input-form-uri';
    inputElement.setAttribute('placeholder', 'Enter URI to video stream or choose from one of the example assets below')
    inputElement.id = 'uri';

    const exampleElement = document.createElement('select');
    exampleElement.className = 'analyzer-input-form-examples';
    exampleElement.id = 'examples';
    let exampleHtml = '';
    exampleHtml += '<option></option>';
    EXAMPLE_ASSETS.forEach(asset => {
      exampleHtml += `<option value="${asset.uri}">${asset.name}</option>`;
    });
    exampleElement.innerHTML = exampleHtml;
    exampleElement.addEventListener('change', ev => {
      const inp = document.getElementById('uri');
      if (ev.target.value) {
        inp.value = ev.target.value;
      }
    });
    
    formElement.appendChild(inputElement);
    formElement.appendChild(exampleElement);

    const submitButton = document.createElement('button');
    submitButton.className = 'analyzer-input-form-submit';
    submitButton.innerText = 'Load';
    submitButton.type = 'submit';
    formElement.onsubmit = function() {
      if (this._onCloseFunction) {
        this._wrapperElement.className = 'analyzer-dlg analyzer-dlg-close';
        this._onCloseFunction(this.value);
      }
      return false;
    }.bind(this);
    formElement.appendChild(submitButton);

    dlgElement.appendChild(formElement);

    return dlgElement;
  }
}

module.exports = InputDlg;