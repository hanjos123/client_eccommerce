const paginator = function(baseUrl = '', perPage = 10, totalRows = 0, page = 1){
    start = 1;
    end = Math.ceil(totalRows / perPage);
    cssClass = page == 1 ? 'disabled' : '';
    html = `
    <div class="row">
        <div class="col-sm-12 col-md-12">
            <div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                <ul class="pagination">
                    <li class="paginate_button page-item previous ${cssClass}">
                        <a href="${baseUrl}?page=${page-1}&perPage=${perPage}" data-dt-idx="0" tabindex="0" class="page-link">Previous</a>
                    </li>`;
    for(i = start; i <= end; i++){
        cssClass = (page == i) ? 'active' : '';
        html += `
        <li class="paginate_button page-item ${cssClass}">
            <a href="${baseUrl}?page=${i}&perPage=${perPage}" data-dt-idx="1" tabindex="0"
                class="page-link">${i}</a>
        </li>`
    }
    cssClass = page == end ? 'disabled' : '';
    html +=`
                    <li class="paginate_button page-item next ${cssClass}">
                        <a href="${baseUrl}?page=${parseInt(page)+1}&perPage=${perPage}" class="page-link">Next</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>`;
    return html;
}

module.exports = {
    paginator
}