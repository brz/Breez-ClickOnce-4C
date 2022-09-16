let canceledDownloadIds = [];

chrome.downloads.onCreated.addListener((downloadItem) => doWork(downloadItem));
chrome.downloads.onDeterminingFilename.addListener((downloadItem) => doWork(downloadItem));

const doWork = (downloadItem) => {
    if(canceledDownloadIds.indexOf(downloadItem.id) !== -1) return;

    //console.log(downloadItem);
    const regexPattern = /https?:\/\/([^/]+\/)+[^/]+\.application(\?.*)?/;
    if(downloadItem.state === "in_progress" && downloadItem.mime === "application/x-ms-application" && regexPattern.test(downloadItem.url)){
        chrome.downloads.cancel(downloadItem.id);
        canceledDownloadIds.push(downloadItem.id);
        chrome.runtime.sendNativeMessage('breez.clickonce.clickoncehelper', { url: downloadItem.url })
        .catch(err => {
            //console.log(err);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var currTab = tabs[0];
                if (currTab) {
                    chrome.tabs.sendMessage(currTab.id, { showDialog: true} );
                }
            });
        });
    }
}