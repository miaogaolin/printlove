
    function cleanup() {
        document.getElementById('input').innerHTML = ""
        document.getElementById('output').innerHTML = '';
    }

    new ClipboardJS('.btn').on('success', function() {
        alert('复制成功')
    }).on('error', function() {
        alert('复制失败,请手动复制')
    });