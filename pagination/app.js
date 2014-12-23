require(['./Pagination'], function(Pagination) {
	var page = new Pagination({container: '.page', total: 600, pageSize: 3, clickCompleate: function (currentPage, pageCount, total) {
		console.info(currentPage, pageCount, total);
	}})
});