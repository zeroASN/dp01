
let layerIndex;

/**
 * 弹出学生新增/更新对话框
 */
function showStudenDlg(id) {
    let title = "新增学生";
    if (id) {
        title = "编辑学生";
        $("#formId").css("display", "block"); // 显示ID字段（如果有）

        // 发送 AJAX 请求获取学生详情
        $.ajax({
            url: `/api/student/${id}`, // 假设接口路径为 /api/student/{id}
            method: "GET",
            dataType: "json"
        }).done(function (result) {
            console.log("获取学生数据成功:", result);
            const student = result.data || result; // 适配返回结构（可能是 R 对象或直接数据）

            // 遍历学生数据，填充到表单字段
            $.each(student, function (key, value) {
                // 确保在 #studForm 范围内查找字段，避免全局匹配
                const $field = $("#studForm [name='" + key + "']");

                if ($field.length) { // 确保字段存在
                    if ($field.is(":radio")) {
                        // 处理单选按钮（value 匹配时选中）
                        $field.filter(`[value="${value}"]`).prop("checked", true);
                    } else if ($field.is(":checkbox")) {
                        // 处理复选框（value 为布尔值或 "yes"/"no" 时选中）
                        $field.prop("checked", value === true || value === "yes");
                    } else {
                        // 处理文本框、下拉框等
                        $field.val(value);
                    }
                }
            });
        }).fail(function (error) {
            console.error("获取学生数据失败:", error);
            layer.msg("加载学生信息失败，请重试", { icon: 5 });
        });
    } else {
        // 新增学生时重置表单
        $("#studForm")[0].reset();
        $("#formId").css("display", "none"); // 隐藏ID字段（如果有）
    }

    // 打开弹出层，并记录 layerIndex
    layerIndex = layer.open({
        type: 1,
        title: title,
        area: ["520px", "auto"],
        content: $("#studForm"), // 确保表单元素正确选择
        success: function () {
            // 弹出层打开后，可选操作（如重置表单状态）
            layui.form.render(); // 重新渲染 layui 表单组件（如果使用了下拉框等）
        }
    });
}


function getSearchCondtion() {
    let formData= {}
    // 遍历每个输入元素，将其值存储到 formData 对象中
    $('#queryForm').find('input, select').each(function() {
        let name = $(this).attr( 'name'); // 获取元素的 name 属性
        let value = $(this).val(); // 获取元素的值

        // 只有 name 属性存在且值不为空才会添加到 formData 中
        if (name && value) {
            formData[name] = value;
        }
    });

    return formData
}


layui.use(function () {

    //(1)验证表单是否合法
    layui.form.on("submit(stud-dlg)", function (data) {
        event.preventDefault(); // 阻止表单默认提交

        commitStuDlg();
    })

    //(2)表格初始化

    const table = layui.table;

    let student = getSearchCondtion();

    // 创建渲染实例
    table.render({
        elem: '#tbStudent',
        url: '/api/student/getbypage', // 此处为静态模拟数据，实际使用时需换成真实接口

        method: "POST",
        contentType: 'application/json', // 确保以 JSON 格式发送
        where: {"data": student},

        page: true,
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {field: 'id', fixed: 'left', width: 80, title: 'id', sort: true},
            {field: 'name', title: '姓名'},
            {
                field: 'sno',
                title: '学号',

                width: 150,

            },
            {field: 'sex', width: 80, title: '性别', sort: true,
                templet: d => d.sex === 1 ? '男' : (d.sex === 2 ? '女' : '未知'),
            },

            {field: 'age', width: 100, title: '年龄', sort: true},

            {field: 'right', title: '操作', width: 134, minWidth: 125, templet: '#editTemplate'}
        ]],
        done: function (rs) {
            //console.log(rs)
        }

    });


    // 触发单元格工具事件
    table.on('tool(tbStudent)', function (obj){

        var data = obj.data; // 获得当前行数据
        // console.log(obj)
        if(obj.event === 'edit'){
            // 调用已有的 showStudenDlg 函数，传入学生ID
            showStudenDlg(data.id);
        }
    });

});

function search(){
    let student = getSearchCondtion();

    const table = layui.table;
    table.reloadData("tbStudent", {
        where: {data:student}
    });
    console.log("where condition:"+JSON.stringify(student))
}

function deleteConfirm(){

    const table = layui.table;
    // 获取表格的选中状态
    const checkStatus = table.checkStatus('tbStudent'); // 'tbStudent' 是你的表格的 ID 或 lay-filter

    console.log(checkStatus)
}

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
            if (result.code === 0) {
                //(4)读取并刷新原来的读学生列表
                const table = layui.table;
                let student = getSearchCondtion();
                table.reload("tbStudent", {
                    where: { data: student }
                });


                //(3)关闭弹出层
                console.log("add success!")
                if (layerIndex)
                    layer.close(layerIndex)


            }

        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Request failed: " + textStatus + " - " + errorThrown);
            // 可以在这里处理错误逻辑
            alert("An error occurred. Please try again.");
        }).always(() => {
            // 无论请求成功还是失败，都恢复按钮状态
            $("#btnOK").prop("disabled", false).removeClass("layui-btn-disabled");
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
            if (result.code === 0) {
                //(4)读取并刷新原来的读学生列表
                const table = layui.table;
                let student = getSearchCondtion();
                table.reload("tbStudent", {
                    where: { data: student }
                });

                //(3)关闭弹出层
                console.log("add success!")
                if (layerIndex)
                    layer.close(layerIndex)


            }

        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Request failed: " + textStatus + " - " + errorThrown);
            // 可以在这里处理错误逻辑
            alert("An error occurred. Please try again.");
        }).always(() => {
            // 无论请求成功还是失败，都恢复按钮状态
            $("#btnOK").prop("disabled", false).removeClass("layui-btn-disabled");
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