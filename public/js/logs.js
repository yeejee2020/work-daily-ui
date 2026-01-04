const API_BASE = "https://work-daily-api.myljyjso.workers.dev/"; // 替换为你的 Worker 地址

// 元素
const addBtn = document.getElementById("addBtn");
const searchBtn = document.getElementById("searchBtn");
const logTable = document.getElementById("logTable").querySelector("tbody");

// 编辑弹窗元素
const editModal = document.getElementById("editModal");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveEditBtn = document.getElementById("saveEditBtn");

// 新增记录
addBtn.addEventListener("click", async () => {
  const work_date = new Date().toISOString().slice(0,10);
  const contact = document.getElementById("contact").value;
  const company = document.getElementById("company").value;
  const method = document.getElementById("method").value;
  const content = document.getElementById("content").value;
  const follow_up = document.getElementById("follow_up").value;
  const remark = document.getElementById("remark").value;

  if(!contact || !content){
    alert("对接人和具体内容为必填");
    return;
  }

  const res = await fetch(`${API_BASE}/logs`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({work_date, contact, company, method, content, follow_up, remark})
  });
  const data = await res.json();
  if(data.success){
    alert("新增成功");
    clearForm();
    loadLogs();
  }
});

// 搜索
searchBtn.addEventListener("click", ()=>{
  loadLogs();
});

// 清空表单
function clearForm(){
  document.getElementById("contact").value = "";
  document.getElementById("company").value = "";
  document.getElementById("content").value = "";
  document.getElementById("follow_up").value = "";
  document.getElementById("remark").value = "";
}

// 加载记录
async function loadLogs(){
  const date = document.getElementById("search_date").value;
  const contact = document.getElementById("search_contact").value;

  const params = new URLSearchParams();
  if(date) params.append("date", date);
  if(contact) params.append("contact", contact);

  const res = await fetch(`${API_BASE}/logs?${params.toString()}`);
  const logs = await res.json();

  renderTable(logs);
}

// 渲染表格
function renderTable(logs){
  logTable.innerHTML = "";
  logs.forEach(log=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.work_date}</td>
      <td>${log.contact}</td>
      <td>${log.company||""}</td>
      <td>${log.method||""}</td>
      <td>${log.content||""}</td>
      <td>${log.follow_up||""}</td>
      <td>${log.remark||""}</td>
      <td>
        <button class="btn" onclick="openEdit(${log.id})">编辑</button>
        <button class="btn btn-danger" onclick="deleteLog(${log.id})">删除</button>
      </td>
    `;
    logTable.appendChild(tr);
  });
}

// 删除
window.deleteLog = async (id)=>{
  if(!confirm("确定删除吗？")) return;
  const res = await fetch(`${API_BASE}/logs/${id}`,{method:"DELETE"});
  const data = await res.json();
  if(data.success) loadLogs();
}

// 打开编辑弹窗
window.openEdit = async (id) => {
  // 先获取数据
  const res = await fetch(`${API_BASE}/logs?` + new URLSearchParams({id}));
  const log = (await res.json())[0];
  if(!log) { alert("记录不存在"); return; }

  editModal.classList.remove("hidden");
  document.getElementById("edit_id").value = log.id;
  document.getElementById("edit_contact").value = log.contact;
  document.getElementById("edit_company").value = log.company||"";
  document.getElementById("edit_method").value = log.method||"电话";
  document.getElementById("edit_content").value = log.content||"";
  document.getElementById("edit_follow_up").value = log.follow_up||"";
  document.getElementById("edit_remark").value = log.remark||"";
};

// 取消编辑
cancelEditBtn.addEventListener("click", ()=>{
  editModal.classList.add("hidden");
});

// 点击遮罩关闭
editModal.addEventListener("click", e=>{
  if(e.target === editModal) editModal.classList.add("hidden");
});

// 保存编辑
saveEditBtn.addEventListener("click", async ()=>{
  const id = document.getElementById("edit_id").value;
  const contact = document.getElementById("edit_contact").value;
  const company = document.getElementById("edit_company").value;
  const method = document.getElementById("edit_method").value;
  const content = document.getElementById("edit_content").value;
  const follow_up = document.getElementById("edit_follow_up").value;
  const remark = document.getElementById("edit_remark").value;

  if(!contact || !content){
    alert("对接人和具体内容为必填");
    return;
  }

  const res = await fetch(`${API_BASE}/logs/${id}`, {
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({contact, company, method, content, follow_up, remark})
  });
  const data = await res.json();
  if(data.success){
    alert("修改成功");
    editModal.classList.add("hidden");
    loadLogs();
  }
});

// 页面加载时刷新列表
loadLogs();
