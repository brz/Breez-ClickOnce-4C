//Inject window.breezClickOnceInstalled property into page
const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null");
    return v;
}
const injectCode = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
        this.remove();
    };
    nullthrows(document.head || document.documentElement).appendChild(script);
}
injectCode(chrome.runtime.getURL('windowObjectHelper.js'));

//Show dialog if the helper executable failed to launch
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.showDialog){
        showDialog();
    }
    sendResponse();
});
const showDialog = () => {
    const modal = document.createElement('div');
    modal.setAttribute("id", "breezClickOnceModal");
    modal.style.cssText = "position: fixed; z-index:2147483647; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0); background-color:rgba(0,0,0,0.4); user-select:none;";

    const modalContent = document.createElement('div');
    modalContent.style.cssText = "background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;";
    modal.appendChild(modalContent);

    const closeBtn = document.createElement('span');
    closeBtn.style.cssText = "color: #aaaaaa; float: right; font-size: 28px; font-weight: bold; cursor:pointer;";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("onclick", "closeBreezClickOnceModal()");
    modalContent.appendChild(closeBtn);

    const p = document.createElement('p');
    p.innerHTML = "To launch the ClickOnce application, <b>Breez ClickOnce Helper</b> needs to be installed on your computer.<br />Click <a href=\"https://breezie.be/dev/clickonce/breezclickoncehelper.exe\" target=\"_blank\">here</a> to download Breez ClickOnce Helper and reload the page after installing.";
    modalContent.appendChild(p);

    document.body.appendChild(modal);
}
injectCode(chrome.runtime.getURL('modalHelper.js'));