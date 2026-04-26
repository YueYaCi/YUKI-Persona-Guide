// js/main.js
(function() {
  'use strict';

  // ----- 获取 DOM 元素 -----
  const overlay = document.getElementById('modalOverlay');
  const contactModal = document.getElementById('contactModal');
  const noticeModal = document.getElementById('noticeModal');
  const categoryModal = document.getElementById('categoryModal');
  const categoryTitle = document.getElementById('categoryModalTitle');
  const categoryList = document.getElementById('categoryLinkList');
  const cardsGrid = document.getElementById('cardsGrid');

  const contactBtn = document.getElementById('contactBtn');
  const noticeBtn = document.getElementById('noticeBtn');

  // ----- 模态框控制函数 -----
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
    // 检查是否还有其他打开的模态框
    const anyActive = [...document.querySelectorAll('.modal-container')].some(m => m.classList.contains('active'));
    if (!anyActive) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-container').forEach(m => m.classList.remove('active'));
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ----- 事件绑定：打开模态框 -----
  contactBtn.addEventListener('click', () => openModal('contactModal'));
  noticeBtn.addEventListener('click', () => openModal('noticeModal'));

  // ----- 关闭按钮事件委托（稳定可靠）-----
  document.addEventListener('click', function(e) {
    const closeTrigger = e.target.closest('[data-close]');
    if (closeTrigger) {
      e.preventDefault();
      e.stopPropagation(); // 防止意外触发其他监听器
      const modalId = closeTrigger.getAttribute('data-close');
      closeModal(modalId);
    }
  });

  // ----- 点击遮罩层关闭模态框（仅当点击的是遮罩本身，而不是内部内容）-----
  overlay.addEventListener('click', function(e) {
    // 只有当点击的目标是遮罩层本身（而不是冒泡上来的子元素）时才关闭
    if (e.target === overlay) {
      closeAllModals();
    }
  });

  // 键盘 ESC 关闭所有模态框
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // ----- 数据加载与卡片渲染 -----
  let categoriesData = [];

  async function loadData() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('data.json 加载失败');
      const data = await response.json();
      categoriesData = data.categories || [];
      renderCards(categoriesData);
    } catch (error) {
      console.warn('使用内置后备数据，请确保 data.json 存在。', error);
      categoriesData = getFallbackCategories();
      renderCards(categoriesData);
    }
  }

  // 后备静态数据 (与 data.json 格式一致)
  function getFallbackCategories() {
    return [
      { id: 'beginner', title: '新手入门~', star: true, items: [
        { text: 'Step 1：认识存档文件（写完了，但是我还没上传仓库... ）', url: '#' },
        { text: 'Step 2：如何找到我的存档？（写完了，但是我还没上传仓库... ）', url: '#' },
        { text: 'Step 3：我该修改哪里？（对不起,我还没写完...）', url: '#' },
        { text: '须知（对不起,我还没写完...）', url: '#' },
        { text: '实用工具（对不起,我还没写完...）', url: '#' }
      ]},
      { id: 'data', title: '游戏内常见数据', star: false, items: [
        { text: '📊 属性阈值表', url: '#' },
        { text: '🗺️ 地图机制', url: '#' },
        { text: '⚔️ 战斗公式', url: '#' },
        { text: '🧪 物品数据', url: '#' },
        { text: '📈 成长曲线', url: '#' }
      ]},
      { id: 'basic', title: '基础：简单人设调整', star: false, items: [
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' }
      ]},
      { id: 'pro', title: '一些大佬的改人设小技巧', star: false, items: [
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' }
      ]},
      { id: 'advanced', title: '进阶：状态栏和多人设等', star: false, items: [
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' }
      ]},
      { id: 'faq', title: '人设常见问题解疑', star: false, items: [
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' },
        { text: '对不起,我还没写完...', url: '#' }
      ]}
    ];
  }

  // 渲染卡片网格
  function renderCards(categories) {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';
    categories.forEach((cat) => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.dataset.categoryId = cat.id;

      // 添加星标 (左上角)
      if (cat.star) {
        const starIcon = document.createElement('span');
        starIcon.className = 'card-star';
        starIcon.innerHTML = '<i class="fas fa-star"></i>';
        card.appendChild(starIcon);
      }

      // 图片容器
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'card-img-wrapper';
      const img = document.createElement('img');
      img.src = `images/card-${cat.id}.jpg`;
      img.alt = cat.title;
      img.loading = 'lazy';
      img.onerror = function() {
        // 加载失败时显示占位图标
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'card-img-placeholder';
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
        if (!imgWrapper.contains(placeholder)) {
          imgWrapper.appendChild(placeholder);
        }
      };
      imgWrapper.appendChild(img);
      card.appendChild(imgWrapper);

      // 底部标题栏（白色背景）
      const titleBar = document.createElement('div');
      titleBar.className = 'card-title-bar';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'card-title';
      titleSpan.textContent = cat.title;
      titleBar.appendChild(titleSpan);
      card.appendChild(titleBar);

      // 点击卡片打开分类详情模态框
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        openCategoryModal(cat);
      });

      cardsGrid.appendChild(card);
    });
  }

  // 打开分类模态框并填充列表
  function openCategoryModal(category) {
    if (!category) return;
    categoryTitle.textContent = category.title;
    
    // 清空并重新生成列表
    categoryList.innerHTML = '';
    const items = category.items || [];
    items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `<i class="fas fa-chevron-circle-right"></i>${item.text}`;
      
      // 如果 url 为 #，阻止跳转并给出提示（方便测试）
      a.addEventListener('click', (e) => {
        if (a.getAttribute('href') === '#') {
          e.preventDefault();
          console.log(`跳转链接 (请替换为真实URL): ${item.text}`);
        }
      });
      
      li.appendChild(a);
      categoryList.appendChild(li);
    });

    openModal('categoryModal');
  }

  // 启动数据加载
  loadData();

})();