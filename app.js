const templates = {
  消火器: [
    "設置場所は適正か",
    "圧力計は正常か",
    "安全栓は装着されているか",
    "腐食・変形はないか",
    "使用期限は有効か"
  ],
  自火報: [
    "感知器の汚損はないか",
    "表示灯は正常か",
    "受信機に異常表示はないか"
  ],
  誘導灯: [
    "点灯状態は正常か",
    "表示面の汚損はないか",
    "バッテリー異常表示はないか"
  ]
};

const equipmentSelect = document.getElementById("equipment");
const checklistDiv = document.getElementById("checklist");

function renderChecklist() {
  checklistDiv.innerHTML = "";
  const items = templates[equipmentSelect.value];
  items.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="checkbox" data-item="${item}">
        ${item}
      </label>
    `;
    checklistDiv.appendChild(div);
  });
}

equipmentSelect.addEventListener("change", renderChecklist);
renderChecklist();

document.getElementById("saveBtn").addEventListener("click", () => {
  const result = document.querySelector('input[name="result"]:checked').value;
  const manufactureYear = document.getElementById("manufactureYear").value;
  const memo = document.getElementById("memo").value;
  const photoInput = document.getElementById("photo");
  const photoFile = photoInput.files[0];

  if (result === "不良") {
    if (!manufactureYear) {
      alert("不良の場合は製造年を入力してください");
      return;
    }
    if (!memo) {
      alert("不良内容を入力してください");
      return;
    }
    if (!photoFile) {
      alert("不良箇所の写真を撮影してください");
      return;
    }
  }

  const checks = [];
  document
    .querySelectorAll("#checklist input[type=checkbox]")
    .forEach(cb => {
      checks.push({
        item: cb.dataset.item,
        checked: cb.checked
      });
    });

  const reader = new FileReader();
  reader.onload = () => {
    const data = {
      site: document.getElementById("siteName").value,
      equipment: equipmentSelect.value,
      result,
      manufactureYear,
      memo,
      photo: photoFile ? reader.result : null,
      checks,
      date: new Date().toISOString()
    };

    localStorage.setItem(Date.now(), JSON.stringify(data));
    alert("保存しました");
  };

  if (photoFile) {
    reader.readAsDataURL(photoFile);
  } else {
    reader.onload();
  }
});
