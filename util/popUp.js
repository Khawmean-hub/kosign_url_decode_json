// export const pop = {
//     error: onError,
//     info: onInfo,
//     success: onSuccess,
//     waring: onWaring,
//     confirm: onConfirm
// }

const duration = 500;

//$('body').append('<div id="pop-main"></div>')

function onError({description="Error",title="Error",btnName='OK' ,callBack = ()=>{}, local = 'en'}){


    const id = Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal

    $('#pop-main').append(generateError('err'+id, translate(btnName, local), translate(title, local), description, '#F44336')); // Append modal to body
    
    $('#err'+id).modal('show'); // show modal

    // apply function for button
    $('#err'+id+' .actions-single .button').click(function(){
        callBack();
        $('#err'+id).modal("hide");
        setTimeout(function(){
            $('#err'+id).remove();
        }, duration)
    })

}

function onInfo({description="Information",title="Information",btnName='OK' ,callBack = ()=>{}, local = 'en'}){
    const id = Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal

    $('#pop-main').append(generateError('err'+id, translate(btnName, local), translate(title, local), description, '#154461')); // Append modal to body
    
    $('#err'+id).modal('show'); // show modal

    // apply function for button
    $('#err'+id+' .actions-single .button').click(function(){
        callBack();
        $('#err'+id).modal("hide");
        setTimeout(function(){
            $('#err'+id).remove();
        }, duration)
    })
}

function onSuccess({description="Success",title="Success",btnName='OK' ,callBack = ()=>{},  local = 'en'}){
    const id = Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal

    $('#pop-main').append(generateError('err'+id, translate(btnName, local), translate(title, local), description, '#2E7D31')); // Append modal to body
    
    $('#err'+id).modal('show'); // show modal

    // apply function for button
    $('#err'+id+' .actions-single .button').click(function(){
        callBack();
        $('#err'+id).modal("hide");
        setTimeout(function(){
            $('#err'+id).remove();
        }, duration)
    })
}

function onWaring({description="Warning",title="Warning",btnName='OK' ,callBack = ()=>{},  local = 'en'}){
    const id = Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal

    $('#pop-main').append(generateError('err'+id, translate(btnName, local), translate(title, local), description, '#c5bc13')); // Append modal to body
    
    $('#err'+id).modal('show'); // show modal

    // apply function for button
    $('#err'+id+' .actions-single .button').click(function(){
        callBack();
        $('#err'+id).modal("hide");
        setTimeout(function(){
            $('#err'+id).remove();
        }, duration)
    })
}

const option = {
    title: 'Confirm',
    description: 'Do you want to delete this app?',
    cancelButtonName: 'NO',
    confirmButtonName: 'YES',
    onCancel: ()=>{},
    onConfirm: ()=>{}
}

function onConfirm({title = "Confirm", description = "Do you want to delete this app?" , cancelButtonName = "NO", confirmButtonName = "YES", onCancel = ()=>{} , onConfirm = ()=>{},  local = 'en'}){
    
    const id = Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal

    $('#pop-main').append(generateConfirm('err'+id, translate(cancelButtonName, local), translate(confirmButtonName, local), translate(title, local), description)); // Append modal to body
    
    $('#err'+id).modal('show'); // show modal

    // apply function for button Confirm
    $('#err'+id+' .positive').click(function(){
        onConfirm();
        $('#err'+id).modal("hide");
        setTimeout(function(){
            $('#err'+id).remove();
        }, duration)
    })
    // apply function for button Cancel
    $('#err'+id+' .negative').click(function(){
        onCancel();
        $('#err'+id).modal("hide");
        setTimeout(function(){
            $('#err'+id).remove();
        }, duration)
    })
}


// Translate

function translate(str, locale){
    switch(locale){
        case 'km':
            switch(str){
                case 'NO':
                    return 'បដិសេធ';
                case 'YES':
                    return 'យល់ព្រម';
                case 'OK':
                    return 'បិទ';
                case 'Error':
                    return 'មានបញ្ហា';
                case 'Information':
                    return 'ព័ត៌មាន'
                case 'Success':
                    return 'ជោគជ័យ';
                case 'Warning':
                    return 'ព្រមាន';
                case 'Confirm':
                    return 'បញ្ជាក់';
            }
        case 'ko':
            switch(str){
                case 'NO':
                    return '아니';
                case 'YES':
                case 'OK':
                    return '확인';
                case 'Error':
                    return '오류';
                case 'Information':
                    return '정보'
                case 'Success':
                    return '성공';
                case 'Warning':
                    return '경고';
                case 'Confirm':
                    return '확인하다';
            }
        case 'en':
            return str;
    }
}

//
function generateError(id, buttonName, title, description, color){
return `<div class="ui modal mini transition" id="${id}" style="outline: 2px solid ${color};border-radius: 10px;overflow: hidden;">
    <div class="header" style="border-bottom: none !important; padding-bottom: 0px; padding-top: 25px">
        <div class="info" style="text-align: center; font-size: 14px !important; color: ${color};">${title}</div>
    </div>
    <div class="content" style="text-align: center !important;  font-size: 18px;  font-weight: 500;  color: #144461;  font-family: "Rubik", "Nokora", sans-serif;">
        <p>${description}</p>
    </div>
    <div class="actions-single" style="margin-top: 5px; display: grid; justify-content: center; background: none !important; border-top: none !important; padding-bottom: 30px;">
        <button class="ui positive button" style="background-color: ${color}; border-radius: 10px !important; padding: 13px 50px;">
        ${buttonName}
        </button >
    </div>
    </div>`;
}

function generateConfirm(id, btnNo, btnYes, title, description){
    return `<div class="ui modal mini transition" id="${id}" style="outline: 2px solid #144461;border-radius: 10px;overflow: hidden;">
    <div class="header" style="border-bottom: none !important; padding-bottom: 0px; padding-top: 25px">
        <div class="info" style="text-align: center; font-size: 14px !important; color: #144461;">${title}</div>
    </div>
    <div class="content" style="text-align: center !important;  font-size: 18px;  font-weight: 500;  color: #144461;  font-family: "Rubik", "Nokora", sans-serif;">
        <p>${description}</p>
    </div>
            <div class="actions" style="display: grid; grid-template-columns: 50% 50%;  background: none !important;  border-top: none !important; padding-bottom: 25px;">
                <button  class="ui negative button" style="background-color: #023452; border-radius: 10px; padding: 13px 50px;">
                    ${btnNo}
                </button >
                <button  class="ui positive button" style="background-color: #F44336; border-radius: 10px; padding: 13px 50px;">
                    ${btnYes}
                </button >
            </div>
        </div> `
};

