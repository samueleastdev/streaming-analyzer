class ErrorDlg {
  constructor() {
    this._wrapperElement = this._initErrorDlg();
  }

  show() {
    this._wrapperElement.className = 'analyzer-error analyzer-error-visible';
  }

  hide() {
    this._wrapperElement.className = 'analyzer-error analyzer-error-hidden';
  }

  get wrapper() {
    return this._wrapperElement;
  }

  set message(msg) {
    this._message = msg;
    this._wrapperElement.innerHTML = msg;
  }

  _initErrorDlg() {
    const dlgElement = document.createElement('div');
    dlgElement.className = 'analyzer-error analyzer-error-hidden';
    dlgElement.id = 'analyzer-error';
   
    return dlgElement;
  }
}

module.exports = ErrorDlg;