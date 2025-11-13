import {XLSX} from "./js/xlsx.full.min.js";

// 全局常量
const options = {
  header: "1",
  raw: true,
  dateNF: "yyyy-mm-dd hh:mm:ss",
};

// 全局变量
let info = [];

// 获取文件输入元素
const fileInput = document.getElementById("fileInput");

// 监听文件选择事件
fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  // 读取文件内容
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const table = XLSX.utils.sheet_to_row_object_array(worksheet, options);
    // 提取所需信息
    info = table.map((e) => {
      return {
        创建人: e["创建人"],
        创建时间: e["创建时间"],
        创建人部门: e["创建人部门"],
        工作状态: e["工作状态"],
        隐患照片: e["隐患照片"],
        防护措施照片: e["防护措施照片"],
      };
    });
    // 创建照片列表
    createPhotoList();
  };
  // 读取文件内容
  fileReader.readAsArrayBuffer(file);
});

// 创建照片列表
function createPhotoList() {
  const photoTemplate = document.getElementById("photoTemplate");
  const clone = photoTemplate.content.cloneNode(true);
  const photoList = clone.querySelector(".photo-list");
  info.forEach((e) => {
    const li = document.createElement("li");
    li.innerHTML = `
                    <span>${e["创建人"]}</span>
                    <span>${e["创建时间"]}</span>
                    <span>${e["创建人部门"]}</span>
                    <span>${e["工作状态"]}</span>
                    <img src="${e["隐患照片"]}" alt="隐患照片" class="info-photo">
                    <img src="${e["防护措施照片"]}" alt="防护措施照片" class="info-photo">
                `;
    photoList.appendChild(li);
  });
  document.body.appendChild(clone);
}
