// js/main.js
(function() {
  'use strict';

  // ----- 获取DOM元素 -----
  const overlay = document.getElementById('modalOverlay');
  const contactModal = document.getElementById('contactModal');
  const noticeModal = document.getElementById('noticeModal');
  const categoryModal = document.getElementById('categoryModal');
  const categoryTitle = document.getElementById('categoryModalTitle');
  const categoryList = document.getElementById('categoryLinkList');
  const cardsGrid = document.getElementById('cardsGrid');

  const contactBtn = document.getElementById('contactBtn');
  const noticeBtn = document.getElementById('noticeBtn');

  // 关闭按钮 (通过事件委托)
  document.addEventListener('click', function(e) {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      const modalId = closeBtn.getAttribute('data-close');
      closeModal(modalId);
    }
  });

  // 点击遮罩关闭所有模态框
  overlay.addEventListener('click', function() {
    closeAllModals();
  });

  // ----- 模态框控制 -----
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

  // 绑定打开按钮
  contactBtn.addEventListener('click', () => openModal('contactModal'));
  noticeBtn.addEventListener('click', () => openModal('noticeModal'));

  // ----- 数据：从 JSON 加载 (同时渲染卡片) -----
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
      // 后备静态数据 (结构与json一致)
      categoriesData = getFallbackCategories();
      renderCards(categoriesData);
    }
  }

  // 后备数据 (保持与json格式相同)
  function getFallbackCategories() {
    return [
      { id: 'beginner', title: '新手入门~', star: true, items: [
        { text: '⏯️ 快速上手指南', url: '#' },
        { text: '📝 设定模板下载', url: '#' },
        { text: '🎭 世界观基础', url: '#' },
        { text: '🔰 避免常见错误', url: '#' },
        { text: '📚 推荐阅读顺序', url: '#' }
      ]},
      { id: 'data', title: '游戏内常见数据', star: false, items: [
        { text: '📊 属性阈值表', url: '#' },
        { text: '🗺️ 地图机制', url: '#' },
        { text: '⚔️ 战斗公式', url: '#' },
        { text: '🧪 物品数据', url: '#' },
        { text: '📈 成长曲线', url: '#' }
      ]},
      { id: 'basic', title: '基础：简单人设调整', star: false, items: [
        { text: '✏️ 性格标签微调', url: '#' },
        { text: '💬 口癖与语气', url: '#' },
        { text: '🎨 外观微调思路', url: '#' },
        { text: '🔄 关系网调整', url: '#' },
        { text: '🧰 工具推荐', url: '#' }
      ]},
      { id: 'pro', title: '大佬改人设心得', star: false, items: [
        { text: '🌟 深度访谈技巧', url: '#' },
        { text: '🧠 心理动机设计', url: '#' },
        { text: '🎯 矛盾塑造', url: '#' },
        { text: '📖 弧光案例', url: '#' },
        { text: '🖋️ 文风统一', url: '#' }
      ]},
      { id: 'advanced', title: '进阶：字数和多人设等', star: false, items: [
        { text: '📏 字数控制策略', url: '#' },
        { text: '👥 多人设互动', url: '#' },
        { text: '🕹️ 分支管理', url: '#' },
        { text: '🧩 记忆与一致性', url: '#' },
        { text: '🔁 动态调整', url: '#' }
      ]},
      { id: 'faq', title: '人设常见问题解疑', star: false, items: [
        { text: '❓ OOC怎么办', url: '#' },
        { text: '🔄 人设冲突处理', url: '#' },
        { text: '📞 反馈渠道', url: '#' },
        { text: '🛠️ 修复工具', url: '#' },
        { text: '📌 常见误区', url: '#' }
      ]}
    ];
  }

  // 渲染卡片
  function renderCards(categories) {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';
    categories.forEach((cat, index) => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.dataset.categoryId = cat.id;
      card.dataset.index = index;

      // 星标
      if (cat.star) {
        const starIcon = document.createElement('span');
        starIcon.className = 'card-star';
        starIcon.innerHTML = '<i class="fas fa-star"></i>';
        card.appendChild(starIcon);
      }

      const titleSpan = document.createElement('span');
      titleSpan.className = 'card-title';
      titleSpan.textContent = cat.title;
      card.appendChild(titleSpan);

      // 点击卡片打开分类模态框
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        openCategoryModal(cat);
        // 点击动画由CSS :active处理
      });

      cardsGrid.appendChild(card);
    });
  }

  // 打开分类详情模态框，填充列表
  function openCategoryModal(category) {
    if (!category) return;
    categoryTitle.textContent = category.title;
    
    // 清空并填充列表
    categoryList.innerHTML = '';
    const items = category.items || [];
    items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url || '#';
      a.target = '_blank';   // 新标签打开，也可改为 _self，根据需求
      a.rel = 'noopener noreferrer';
      // 加入小图标装饰
      a.innerHTML = `<i class="fas fa-chevron-circle-right"></i>${item.text}`;
      a.addEventListener('click', (e) => {
        // 若网址为#，阻止默认跳转，仅为示意
        if (a.getAttribute('href') === '#') {
          e.preventDefault();
          console.log('跳转链接: 请替换为真实URL');
        }
      });
      li.appendChild(a);
      categoryList.appendChild(li);
    });

    openModal('categoryModal');
  }

  // ----- 初始化&加载数据 -----
  loadData();

  // 可选：点击模态框内容时防止关闭 (因为遮罩点击会关闭)
  document.querySelectorAll('.modal-card').forEach(card => {
    card.addEventListener('click', (e) => e.stopPropagation());
  });

  // 键盘ESC关闭所有
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

})();