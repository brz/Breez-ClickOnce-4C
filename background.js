chrome.downloads.onCreated.addListener((downloadItem) => {
    const regexPattern = /https?:\/\/([^/]+\/)+[^/]+\.application(\?.*)?/;
    if(downloadItem.mime === "application/x-ms-application" && regexPattern.test(downloadItem.url)){
        chrome.downloads.cancel(downloadItem.id);
        chrome.runtime.sendNativeMessage('breez.clickonce.clickoncehelper', { url: downloadItem.url })
        .catch(err => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            if (currTab) {
                chrome.tabs.sendMessage(currTab.id, { showDialog: true} );
            }
        });
    });
    }
}
);