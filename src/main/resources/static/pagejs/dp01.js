
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
            layer.open({
                title: '编辑 - id:' + data.id,
                type: 1,
                area: ['80%','80%'],
                content: '<div style="padding: 16px;">自定义表单元素</div>'
            });
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