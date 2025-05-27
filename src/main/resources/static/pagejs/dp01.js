$(function () {

//todo write my js code at here

    loadStudentList();

});

function loadStudentList() {


    $.ajax({
        url: "/api/student/list"

    }).done(function (data) {

        // console.log(data)
        let html = "";
        data.forEach((element, index) => {
            html += "<tr>"
            html += "<td>" + element.id + "</td>"
            html += "<td>" + element.name + "</td>"
            html += "<td>" + element.sex + "</td>"
            html += "<td>" + element.age + "</td>"
            html += "<td>" + element.sno + "</td>"
            html += "<td>" + element.password + "</td>"

            html += "<td> <a href='#' onclick='showStudenDlg(" + element.id
                + ")'>编辑</a> &nbsp;&nbsp;<a href='#' onclick='deleteById(" +
                +element.id + ")'>删除</a></td>"

            html += "</tr>"
        })
        $("#studentTb").html(html)

    });
}

let layerIndex;

/**
 * 弹出学生新增/更新对话框
 */
function showStudenDlg(id) {

    let title = "新增学生"
    if (id) {
        //是编辑
        title = "编辑学生"
        $("#formId").css("display", "block");

        //读取学生信息，并赋值
        $.ajax({
            url: "/api/student/" + id,
            method: "GET"
        }).done(result => {

            console.log(result)

            // 遍历 result 对象并将值填充到 #studForm 表单中
            $.each(result, function (key, value) {
                // 修改选择器，确保选择的是 #studForm 内的字段
                var field = $('#studForm [name="' + key + '"]');

                if (field.is(':radio')) {
                    field.filter('[value="' + value + '"]').prop('checked', true); // 选单对应的单选按钮
                } else if (field.is(':checkbox')) {
                    field.prop('checked', value === "yes"); // 选中复选框
                } else {
                    field.val(value); // 填充文本框或其他字段
                }
            });
        })


    } else {
        //是新增
        $("#studForm")[0].reset();
        $("#formId").css("display", "none");
    }

    layerIndex = layer.open({
        type: 1,
        title: title,
        area: ['520px', 'auto'],
        content: $('#studForm') //捕获层
    });


}

layui.use(function () {

    //(1)验证表单是否合法
    layui.form.on("submit(stud-dlg)", function (data) {
        event.preventDefault(); // 阻止表单默认提交

        commitStuDlg();
    })


});

function commitStuDlg() {
    let id = $("#id").val()
    let formData = $("#studForm").serialize();
    if (id != null && id != "") {
        //是更新学生

        $.ajax({
            url: "/api/student/update",
            method: "PUT",
            data: formData
        }).done(result => {
            console.log(result);
            if (result.id) {
                //(4)读取并刷新原来的读学生列表
                loadStudentList();

                //(3)关闭弹出层
                console.log("add success!")
                if (layerIndex)
                    layer.close(layerIndex)


            }

        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Request failed: " + textStatus + " - " + errorThrown);
            // 可以在这里处理错误逻辑
            alert("An error occurred. Please try again.");
        });


    } else {

        //新增学生需要进行
        //(2)将表单数据发送到服务器的insert中,把提交按钮变灰

        $.ajax({
            url: "/api/student/add",
            method: "POST",
            data: formData
        }).done(result => {
            console.log(result);
            if (result.id) {
                //(4)读取并刷新原来的读学生列表
                loadStudentList();

                //(3)关闭弹出层
                console.log("add success!")
                if (layerIndex)
                    layer.close(layerIndex)


            }

        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Request failed: " + textStatus + " - " + errorThrown);
            // 可以在这里处理错误逻辑
            alert("An error occurred. Please try again.");
        });

    }


    $("#btnOK").prop("disabled", true).addClass("layui-btn-disabled"); // 禁用按钮


}


function deleteById(id) {

    //删除
    layer.confirm('你真的要删除吗？一旦删除，不可恢复！', {icon: 3}, function () {


            $.ajax({
                url: "/api/student/delete/" + id,
                method: "DELETE"
            }).done(result => {
                loadStudentList();

            })
        layer.closeAll(); // 关闭所有层(包括确认框)



    }, function () {

    });
}