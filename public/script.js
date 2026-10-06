
// 1. 获取 DOM 节点
const commentForm = document.getElementById('comment-form');
const nameInput = document.getElementById('user-name');
const commentInput = document.getElementById('user-comment');
const commentList = document.getElementById('comment-list');
const commentCount = document.getElementById('comment-count');

// 记录当前评论总数
let totalComments = 3;

// 2. 监听表单的提交事件 (submit)
commentForm.addEventListener('submit', async function (e) {
    // 阻止表单默认提交导致页面重新刷新的行为
    e.preventDefault();

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    // 判空保护
    if (!name || !comment) return;


    const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: name,       // 对应 server.js 的 req.body.user
            content: comment  // 对应 server.js 的 req.body.content
        })
    });

    if (!response.ok) {
        alert('评论保存失败，请稍后重试');
        return;
    }

    // 3. 创建一条新的卡片 DOM 节点
    const newCard = document.createElement('div');
    newCard.innerHTML = `
    <div class="flex items-center justify-between mb-1">
        <span class="font-semibold text-slate-800">${escapeHtml(name)}</span>
        <span class="text-xs text-slate-400">Just now</span>
    </div>
    <p class="text-slate-700 text-sm">${escapeHtml(comment)}</p>
    `;

    // 4. 将新留言插入到列表的最顶部
    commentList.prepend(newCard);

    // 5. 更新评论计数角标
    totalComments++;
    commentCount.textContent = `${totalComments} comments`;

    // 6. 清空输入框内容并重置光标焦点
    nameInput.value = '';
    commentInput.value = '';
    nameInput.focus();
});

// 简单的 XSS 防御函数（防止用户输入恶意的 <script> 标签）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
