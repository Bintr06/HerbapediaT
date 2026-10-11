document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('historyList');

    let historyData = [];

    function renderHistory() {
        historyList.innerHTML = '<p class="text-center text-gray-500 font-light mt-10">Bạn chưa có lịch sử tra cứu nào.</p>';
    }

    renderHistory();
});

