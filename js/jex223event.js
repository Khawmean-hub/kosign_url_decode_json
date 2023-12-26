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


$('#btn_export_data').click(function () {
    copy(localStorage.getItem('projects_list'))
    onMessage('Copies to clipboard.')
})

$('#btn_import_data').click(function () {
    $('#import_data_modal').modal('show');
})

$('#btn_save_import_data').click(function () {
    if(isNull($('#import_data_input').val())){
        alert('Please enter import data.')
        return;
    }
    // isNotJson
    if(isNotJson($('#import_data_input').val())){
        alert('Please enter valid json.')
        $('#import_data_input').val('');
        return;
    }

    localStorage.setItem('projects_list', $('#import_data_input').val());
    buildProjectDrop();
    onMessage('Import data successfully.')
    $('#import_data_input').val('');
})