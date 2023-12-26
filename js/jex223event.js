$('#new_project_button').click(function () {
    $('#new_project_modal').modal('show');
})

$('.coupled.modal')
    .modal({
        allowMultiple: true
    })
;
// open second modal on first modal buttons
$('#loard_other_replace')
    .modal('attach events', '#show_other_replace')
;

$('#replace_management_button').click(function () {
    if(isNull(activeProjectId)){
        onMessage('Please select project.', 'error')
        return;
    }
    $('#replace_management_modal').modal('show');
})

$("#btn_save_new_project").click(function () {
    saveNewProject();
    onReplaceJex();
})

$("#btn_delete_project").click(function () {
    if($(this).hasClass('disabled')){
        return;
    }
    deleteProject();
    onReplaceJex();
})

$("#save_new_replace_btn").click(function (){
    onSaveNewReplace();
    onReplaceJex();
});

//on delete replace item
$(document).on('click', '.btn_delete_replace_item', function () {
    onDeleteReplace($(this).attr('data-value'));
})

$("#show_other_replace").click(function () {
    loadOtherReplace();
});

$(document).on('click','.btn_add_key',function () {
    onSaveReplace($(this).attr('data-value'));
    $(this).parent().empty().append('<a className="ui label" style="background: #e3e3e3">Added</a>');
    onReplaceJex();
});