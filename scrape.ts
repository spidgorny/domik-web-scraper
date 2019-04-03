// http://domik.ua/kompanii/kiev/rieltorskie-kompanii.html?shortView=1
document.querySelector('h1').innerText = JSON.stringify(Array.from(document.querySelectorAll('td.catalog_company_name a')).map(a => {
	let tr = a.closest('tr').querySelector('td:nth-child(5)');
	return {name: a.innerText, link: a.getAttribute('href'), rating: tr.innerText};
}));
