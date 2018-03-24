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
    inputElement.setAttribute('placeholder', 'Enter URI to video stream')
    inputElement.id = 'uri';

    formElement.appendChild(inputElement);

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