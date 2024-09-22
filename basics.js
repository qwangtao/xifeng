document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('content');
    const links = document.querySelectorAll('#outline a, header nav a');

    console.log('DOM fully loaded and parsed');

    // 加载默认内容
    loadContent('introduction');

    // 为所有链接添加点击事件监听器
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const topic = this.getAttribute('href').substring(1);
            console.log('Link clicked:', topic);
            loadContent(topic);
        });
    });

    function loadContent(topic) {
        // 将 topic 转换为文件名格式
        const fileName = topic.replace(/([A-Z])/g, '-$1').toLowerCase();
        console.log(`Attempting to load: ${fileName}.html`);
        fetch(`${fileName}.html`)
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                console.log('Content received, length:', html.length);
                contentDiv.innerHTML = html;
                console.log('Content loaded successfully');
                // 更新URL，但不重新加载页面
                history.pushState(null, '', `#${topic}`);
                // 滚动到顶部
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                contentDiv.innerHTML = `<p>抱歉，无法加载内容 "${fileName}.html"。请确保文件存在且名称正确。</p>`;
            });
    }

    // 处理浏览器的后退/前进按钮
    window.addEventListener('popstate', function() {
        const topic = window.location.hash.substring(1) || 'introduction';
        console.log('Popstate event, loading:', topic);
        loadContent(topic);
    });
});