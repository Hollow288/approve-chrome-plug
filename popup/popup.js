var pendingAuditList;
initPendingAudit()

function initPendingAudit(){
    chrome.storage.session.get(["needLogin"]).then((needLogin) => {
        // console.log("Value is " + result.key);
        console.log("找到了",needLogin)
        if(needLogin == null || typeof needLogin === 'undefined' || needLogin.length === 0){
            alert('没有记录到待审核人!', 'success')
        }
    });

}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('flushedBtn')
if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
        initPendingAudit()
        chrome.storage.session.get(["needLogin"]).then((needLogin) => {
            // console.log("Value is " + result.key);
            // console.log(needLogin)
            // if(needLogin == null || typeof needLogin === 'undefined' || needLogin.length === 0){
            //     alert('没有记录到待审核人!', 'success')
            // }
        });
    })
}


