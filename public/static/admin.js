var viewer = null;
const filterEmptyUrls = (array) => {
  return array.filter(item => item.url && item.url !== '');
}
const getList = async () => {
  const res = await fetch('/list');
  const data = await res.json();
  if (data.code == 500) {
    location.href = '/login'
    return
  }
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = '';
  let list=filterEmptyUrls(data.data)
  list.forEach(item => {
    const imageElement = document.createElement('div');
    imageElement.className = 'group cursor-pointer relative';
    imageElement.innerHTML = `
      <div class="group cursor-pointer relative">
        <img src="${item.url}" class="w-full h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105" />
        <div class="absolute inset-0 transition duration-200 bg-gray-900 opacity-0 rounded-2xl group-hover:opacity-60"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center transition duration-200 opacity-0 group-hover:opacity-100">
          <div class="mb-2 shadow-sm w-33 rounded-2xl">
            <a  data-url="${item.url}" class="c-view inline-flex w-full justify-center items-center px-6 py-2 rounded-2xl shadow-sm border border-transparent text-sm font-medium rounded-2xl text-cool-indigo-700 bg-white transition duration-150 hover:bg-cool-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500">查看</a>
          </div>
          <div class="mb-2 shadow-sm w-33 rounded-2xl">
            <a data-url="${item.url}" class="c-copy w-full justify-center inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white transition duration-150 bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500">复制</a>
          </div>
          <div class="shadow-sm w-33 rounded-2xl">
            <a data-key="${item.key}" class="c-del w-full justify-center inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white transition duration-150 bg-red-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500">删除</a>
          </div>
        </div>
      </div>
    `;
    imageContainer.appendChild(imageElement);
  });

  // 绑定事件监听器
  const copyButtons = document.querySelectorAll('.c-copy');
  const viewButtons = document.querySelectorAll('.c-view');
  const delButtons = document.querySelectorAll('.c-del');
  copyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const url = location.origin + this.dataset.url;
      console.log(url);
      copyToClipboard(url);
    });
  });
  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const imageElement = this.closest('.group');
      const imageUrl = this.dataset.url;
      console.log(imageUrl);
      if (viewer) {
        viewer.hide();
        viewer.destroy();
      }
      viewer = new Viewer(imageElement.querySelector('img'), {});
      viewer.show();
    });
  });
  delButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      let key = this.dataset.key
      delItem(key)
    })
  })
};
const delItem = async (key) => {
  const res = await fetch(`/del/${key}`);
  const data = await res.json();
  if (data.code == 200) {
    getList();
  }
}
document.addEventListener('DOMContentLoaded', function () {
  getList();
});

function copyToClipboard(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  const calert = document.getElementById('calert')
  calert.innerText = '复制成功'
  calert.style.display = 'block';
  setTimeout(() => {
    calert.style.display = 'none';
  }, 3000)
}