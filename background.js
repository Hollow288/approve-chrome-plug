
let popupWindowId = null; // 用于保存窗口 ID

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 检查页面加载状态
    debugger
    if (changeInfo.status === 'complete') {
        // 执行脚本注入
        injectScript();
    }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'openOrHideMenuOpen') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: openOrHideMenuClose
                });
            } else {
                console.error('No active tab found.');
            }
        });
    }

    if (request.action === 'openOrHideMenuClose') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: openOrHideMenuOpen
                });
            } else {
                console.error('No active tab found.');
            }
        });
    }


    if (request.action === 'openFloatingWindow') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                // 如果窗口已经存在，不再创建新的窗口
                if (popupWindowId) {
                    chrome.windows.get(popupWindowId, (window) => {
                        if (chrome.runtime.lastError || !window) {
                            // 如果窗口 ID 无效或窗口已关闭，重置 popupWindowId 并创建新窗口
                            createPopupWindow();
                        } else {
                            console.log("窗口已存在，不再创建新的窗口。");
                            chrome.windows.update(popupWindowId, { focused: true });
                        }
                    });
                } else {
                    // 如果没有已存在的窗口，创建一个新窗口
                    createPopupWindow();
                }
            } else {
                console.error('No active tab found.');
            }
        });
    }
});


function createPopupWindow() {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup/copy.html"),
        type: "popup",
        width: 400,
        height: 300,
        state: "normal"
    }, (newWindow) => {
        // 保存新创建窗口的 ID
        popupWindowId = newWindow.id;
    });
}

function openOrHideMenuClose() {
    const elements4 = document.querySelectorAll('.ant-col-4');
    const elements20 = document.querySelectorAll('.ant-col-20');

    elements4.forEach(element => {
        element.style.flex = '0 0 0%';
        element.style.maxWidth = '0%';
        element.style.height = 0;
    });

    elements20.forEach(element => {
        element.style.flex = '0 0 100%';
        element.style.maxWidth = '100%';
    });

}

function openOrHideMenuOpen() {
    const elements4 = document.querySelectorAll('.ant-col-4');
    const elements20 = document.querySelectorAll('.ant-col-20');

    elements4.forEach(element => {
        element.style.flex = '0 0 16%';
        element.style.maxWidth = '16%';
        element.style.height = `calc(-150px + 100vh)`;
    });

    elements20.forEach(element => {
        element.style.flex = '0 0 83%';
        element.style.maxWidth = '83%';
    });

}



function injectScript() {
    // 查询当前活动的标签页
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0];
        // 执行脚本注入
        chrome.scripting.executeScript({
            target: {tabId: activeTab.id},
            func: injectedFunction
        });
    });
}


function injectedFunction() {


    function findIframeBySrc(doc, targetSrc) {
        // Get all iframes in the current document
        var iframes = doc.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            // Check if the src of the iframe matches the targetSrc
            if (iframe.src.includes(targetSrc)) {
                return iframe;
            } else {
                // Recursively search within the iframe
                var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                var foundIframe = findIframeBySrc(innerDoc, targetSrc);
                if (foundIframe) {
                    return foundIframe;
                }
            }
        }
        return null;
    }


    function setupButtonListener(iframe) {
        let targetIframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        let theLastIframeBody = targetIframeDoc.body;
        // 创建一个新的 MutationObserver 来监视按钮元素的出现
        var listObserver = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检查新添加的节点是否是目标按钮
                    mutation.addedNodes.forEach(function(node) {

                        // 从我的代办中发流程
                        if (node.outerHTML.indexOf('boe/approve.html')>-1) {
                            debugger
                            let approveIframe = findIframeBySrc(document,"approve.html?v=1.02&token=")
                            approveIframe.onload = function (){
                                let confirm  = node.getElementsByClassName('layui-layer-btn0')

                                let theIframeDoc = approveIframe.contentDocument || approveIframe.contentWindow.document;
                                let listByClassName = theIframeDoc.getElementsByClassName("list-group")
                                Array.from(confirm)[0].addEventListener('click', function() {
                                    // console.log(listByClassName)
                                    debugger
                                    //listByClassName[0]->list-group-item noborder  .children[1]->ul.list-group .children->list-group-item noborder item-cursor
                                    // let inputAndSpanList = listByClassName[0].children[1].children
                                    let inputAndSpanList = Array.from(listByClassName[0].children).filter(child => child.tagName.toLowerCase() === 'ul')[0];
                                    //所有勾选的list
                                    debugger
                                    console.log("back")
                                    // let chekcedList = Array.from(inputAndSpanList).filter(n=>{return n.children[0].checked})
                                    let chekcedList = Array.from(inputAndSpanList.children).filter(n=>{return n.children[0].checked});
                                    // 这里清空一下,因为是这次发的
                                    let needAuditEmployee = [];
                                    chekcedList.forEach(n=>{needAuditEmployee.push(n.innerText)})

                                    const regex = /\s*\([^)]*\)\s*/g;
                                    needAuditEmployee.forEach((n, index)=>{
                                        needAuditEmployee[index] = n.replace(regex, '').trim();
                                    })

                                    chrome.storage.local.get(["needAuditEmployee"]).then((localEmployees) => {
                                        let resultArr = needAuditEmployee.concat(localEmployees.needAuditEmployee)
                                        chrome.storage.local.set({ needAuditEmployee: resultArr },() => {});
                                    });

                                    //Todo VM2864:76 Uncaught (in promise) Error: Access to storage is not allowed from this context.
                                    //     at HTMLAnchorElement.<anonymous> (<anonymous>:76:33)

                                    // chrome.storage.local.get(["needAuditEmployee"]).then((needAuditEmployee) => {
                                    //     console.log("Value is " + needAuditEmployee.key);
                                    //     console.log(needAuditEmployee)
                                    // });

                                });
                            }
                        }

                        //新增发流程
                        if(node.outerHTML.indexOf('wfrStart.html')>-1){
                            let approveIframe = findIframeBySrc(document,"wfrStart.html")
                            approveIframe.onload = function (){
                                let confirm  = node.getElementsByClassName('layui-layer-btn0')

                                let theIframeDoc = approveIframe.contentDocument || approveIframe.contentWindow.document;
                                let listByClassName = theIframeDoc.getElementsByClassName("list-group")
                                Array.from(confirm)[0].addEventListener('click', function() {

                                    //listByClassName[0]->list-group-item noborder  .children[2]->ul.list-group .children->list-group-item noborder item-cursor
                                    let inputAndSpanList = listByClassName[0].children[2].children
                                    //所有勾选的list
                                    let chekcedList = Array.from(inputAndSpanList).filter(n=>{return n.children[0].checked})
                                    // 这里清空一下,因为是这次发的
                                    needAuditEmployee = [];
                                    chekcedList.forEach(n=>{needAuditEmployee.push(n.innerText)})

                                    const regex = /\s*\([^)]*\)\s*/g;
                                    needAuditEmployee.forEach((n, index)=>{
                                        needAuditEmployee[index] = n.replace(regex, '').trim();
                                    })

                                    chrome.storage.local.get(["needAuditEmployee"]).then((localEmployees) => {
                                        let resultArr = needAuditEmployee.concat(localEmployees.needAuditEmployee)
                                        chrome.storage.local.set({ needAuditEmployee: resultArr },() => {});
                                    });
                                    //Todo VM2864:76 Uncaught (in promise) Error: Access to storage is not allowed from this context.
                                    //     at HTMLAnchorElement.<anonymous> (<anonymous>:76:33)

                                    // chrome.storage.local.get(["needAuditEmployee"]).then((needAuditEmployee) => {
                                    //     console.log("Value is " + needAuditEmployee.key);
                                    //     console.log(needAuditEmployee)
                                    // });
                                });
                            }
                        }


                    });
                }
            }
        });

        // 监视按钮元素的父级容器的变化
        listObserver.observe(theLastIframeBody, {childList: true, subtree: true});

    }

    // 使用 MutationObserver 监视目标 iframe 的出现
    let observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 选择所有的 iframe 元素
                var iframes = document.querySelectorAll('iframe');
                // // 获取最后一个添加的 iframe
                // var lastIframe = iframes[iframes.length - 1];
                for (let i = 0; i < iframes.length; i++) {
                    if(iframes[i].src.includes("/commonPage.html")){
                        iframes[i].onload = function (){
                            setupButtonListener(iframes[i]);
                        }
                        break
                    }
                }

            }
        }
    });

    if(document.body instanceof Node) {
        observer.observe(document.body, {childList: true, subtree: true});
    }

}


