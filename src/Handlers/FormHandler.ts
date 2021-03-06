import { HttpClient } from "../Http/HttpClient";

export class FormHandler {
    private _editor: any;
    private _spinner: Element;

    constructor(editor: any) {
        this._editor = editor;
        let button = document.getElementsByClassName('request-card__submit-button')[0];
        button.addEventListener('click', () => {
            this.handleButtonPress();
        });
        this._spinner = document.getElementsByClassName('request-card__spinner')[0];
    }

    handleButtonPress() {
        let url = <HTMLFormElement>document.getElementsByClassName('request-card__url-input')[0];
        let requestType = <HTMLFormElement>document.getElementsByClassName('mdl-textfield__input')[0];

        if (url.value.length <= 0)
            return;

        if (requestType.value.length <= 0)
            return;

        this._spinner.setAttribute('style', 'opacity:1;');

        let httpClient = new HttpClient(url.value, requestType.value);
        httpClient.invoke((data) => this.handleResponse(data));
    }

    handleResponse(data) {
        let statusCodeIndicator = document.getElementsByClassName('stat__response-status')[0];
        statusCodeIndicator.innerHTML = `<span class="_${data.status}">${data.status} ${data.statusText}</span>`;

        let timeTakenIndicator = document.getElementsByClassName('stat__time-taken')[0];
        timeTakenIndicator.innerHTML = `${data.timeTaken}<small>ms</small>`;

        let responseSizeIndicator = document.getElementsByClassName('stat__response-size')[0];
        responseSizeIndicator.innerHTML = `${data.contentSize}<small>B</small>`;

        let parsedBody = data.content;

        try {
            parsedBody = JSON.stringify(JSON.parse(data.content), null, '\t');
        } catch (e) {
            // do nothing
        }

        this._editor.setValue(parsedBody, -1);

        let responseHeadersHtml = '';
        for (let key in data.headers) {
            responseHeadersHtml += `<p><strong>${data.headers[key].name}:</strong> ${data.headers[key].value}</p>`;
        }

        let responseHeaders = document.getElementsByClassName('response-card__headers')[0];
        responseHeaders.innerHTML = responseHeadersHtml;

        this._spinner.setAttribute('style', 'opacity:0;');
    }
}