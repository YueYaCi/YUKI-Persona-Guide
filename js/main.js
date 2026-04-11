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

  // ----- 关闭按钮事件：使用事件委托 (稳定可靠) -----
  document.addEventListener('click', function(e) {
    // 查找被点击的元素或其父级是否带有 data-close 属性
    const closeTrigger = e.target.closest('[data-close]');
    if (closeTrigger) {
      e.preventDefault();  // 防止任何默认行为
      e.stopPropagation(); // 避免意外触发其他事件
      const modalId = closeTrigger.getAttribute('data-close');
      closeModal(modalId);
    }
  });

  // 点击遮罩层关闭所有模态框
  overlay.addEventListener('click', closeAllModals);

  // 键盘 ESC 关闭所有模态框
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // 阻止模态框内部点击事件冒泡到遮罩层（避免误关闭）
  document.querySelectorAll('.modal-card').forEach(card => {
    card.addEventListener('click', (e) => e.stopPropagation());
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

      const titleSpan = document.createElement('span');
      titleSpan.className = 'card-title';
      titleSpan.textContent = cat.title;
      card.appendChild(titleSpan);

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

  // 动态生成的关闭按钮也能通过事件委托正常工作，无需额外处理

})();