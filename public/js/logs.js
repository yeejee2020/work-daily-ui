const API_BASE = "https://work-daily-api.myljyjso.workers.dev/"; // 替换为你的 Worker 地址

const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", async () => {
  const work_date = new Date().toISOString().slice(0, 10);
  const contact = document.getElementById("contact").value;
  const company = document.getElementById("company").value;
  const method = document.getElementById("method").value;
  const content = document.getElementById("content").value;
  const follow_up = document.getElementById("follow_up").value;
  const remark = document.getElementById("remark").value;

  if (!contact || !content) {
    alert("对接人和具体内容为必填");
    return;
  }

  const res = await fetch(`${API_BASE}/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      work_date,
      contact,
      company,
      method,
      content,
      follow_up,
      remark
    })
  });

  const data = await res.json();
  if (data.success) {
    alert("新增成功！");
    // 可清空表单
    document.getElementById("contact").value = "";
    document.getElementById("company").value = "";
    document.getElementById("content").value = "";
    document.getElementById("follow_up").value = "";
    document.getElementById("remark").value = "";

    // 刷新记录列表
    loadLogs(); 
  } else {
    alert("新增失败：" + (data.error || "未知错误"));
  }
});

// 可选：初始化加载已有记录
async function loadLogs() {
  const res = await fetch(`${API_BASE}/logs`);
  const logs = await res.json();
  console.log("日志列表", logs);
  // TODO: 渲染到页面
}
