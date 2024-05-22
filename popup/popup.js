var pendingAuditList;
initPendingAudit()

const arrayList = document.getElementById('array-list');

function initPendingAudit(){

    chrome.storage.local.get(["needAuditEmployee"]).then((needAuditEmployee) => {
        if(typeof needAuditEmployee.needAuditEmployee === 'undefined' || needAuditEmployee.needAuditEmployee.length === 0){
            alert('没有记录到待审核人!', 'success')
        }else{
            console.log(needAuditEmployee.needAuditEmployee)
            displayArray(needAuditEmployee.needAuditEmployee);
        }
    });

}


// 显示数组内容
function displayArray(arr) {
    // 清空当前列表
    arrayList.innerHTML = '';
    // 遍历数组并创建列表项
    arr.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        arrayList.appendChild(li);
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
        // chrome.storage.local.get(["needAuditEmployee"]).then((needAuditEmployee) => {
        //     if(typeof needAuditEmployee.needAuditEmployee === 'undefined' || needAuditEmployee.needAuditEmployee.length === 0){
        //         alert('没有记录到待审核人!', 'success')
        //     }
        // });
    })
}


