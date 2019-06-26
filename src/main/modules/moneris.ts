
interface MonerisResponse {
    data: any;
    origin: any;
}

export class Moneris {

    constructor() {
        if (window.addEventListener) {
            window.addEventListener('message', this.respMsg, false);
        }
    }

    public doMonerisSubmit() {
        var monFrameRef = (<any>document.getElementById('monerisFrame')).contentWindow;
        monFrameRef.postMessage('', 'https://esqa.moneris.com/HPPtoken/index.php');
        //change link according to table above
        return false;
    }

    public respMsg(e: MessageEvent) {
        if(e.origin.indexOf('https://esqa.moneris.com') === -1) {
            return;
        }
        var respData = eval('(' + e.data + ')');
        document.getElementById('monerisResponse')!.innerHTML = '<div><span>Origin : ' + e.origin + '</span></div><div><span>Response Code : ' +
            respData.responseCode + '</span></div><div><span>Data key : ' + respData.dataKey + '</span></div>';
        document.getElementById('monerisFrame')!.style.display = 'none';
    }
}
