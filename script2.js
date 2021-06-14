function hashTable(size) {
	this.count = 0;
	this.size = size;
	this.maxLoadFactor = 0.667;
    this.increaseBy = 1.5;
	this.table = new Array(size);
}

hashTable.prototype.hash = function(key) {
    var total = 0;
    for (var i = 0; i < key.length; i++) {
        total = (total + key.charCodeAt(i)) * 31;
    }
    let a = total % this.size;
    return a;
}

hashTable.prototype.add = function(key, value) {
	var key = key.replace(/-/g, '');
	var hash = this.hash(key);

	if (this.table[hash]) {
		if (this.table[hash].key == key) {
			//this.table[hash].value = value;
            alert("Дубликаты запрещены!");
		} else {
			var val = this.probe(hash)
			this.table[val] = {key, value};
			this.count++;
		}
	} else {
		this.table[hash] = {key, value};
		this.count++;
	}
	if (this.count >= (this.size * this.maxLoadFactor)) {
		this.increaseSize();
	}
}

hashTable.prototype.probe = function(hash) {
	var a = 1;
	var i = 0;
	var val = (hash + (a * i)) % this.size;
	while (this.table[val]) {
		i++;
		val = (hash + (a * i)) % this.size;
	}
	return val;
}

hashTable.prototype.increaseSize = function() {
	var temp = this.table;
	this.size = Math.round(this.size * this.increaseBy);
	this.table = new Array(this.size);
	for (i = 0; i < temp.length; i++) {;
		if (temp[i]) {
			var key = temp[i].key;
			var value = temp[i].value;
			var hash = this.hash(key);
			if (this.table[hash]) {
				var val = this.probe(hash);
				this.table[val] = {key, value};
			} else {
				this.table[hash] = {key, value};
			}
		}
	}
}

hashTable.prototype.get = function(key) {
	var key = key.replace(/-| /g, '');
	var hash = this.hash(key);
	var a = 1;
	var i = 0;
	var val = (hash + (a * i)) % this.size;

	if (this.table[hash]) {
		if (this.table[hash].key == key) {
			return this.table[hash].value;
		} else {
			while (this.table[val]) {
				if (this.table[val].key == key) {
					return this.table[val].value;
				}
				i++;
				val = (hash + (a * i)) % this.size;
			}
		}
	}
}

hashTable.prototype.remove = function(key) {
	var key = key.replace(/-| /g, '');
	var hash = this.hash(key);
	var a = 1;
	var i = 0;
	var val = (hash + (a * i)) % this.size;

	if (this.table[hash]) {
		if (this.table[hash].key == key) {
			delete this.table[hash];
			this.count--;
		} else {
			while (this.table[val]) {
				if (this.table[val].key == key) {
					delete this.table[val];
					this.count--;
					break;
				}
				i++;
				val = (hash + (a * i)) % this.size;
			}
		}
	}
	if (this.count < (this.size * this.maxLoadFactor)) {
		this.decreaseSize();
	}
}

hashTable.prototype.decreaseSize = function() {
	var temp = this.table;
	this.size = Math.round(this.size / this.increaseBy);
	this.table = new Array(this.size);
	for (i = 0; i < temp.length; i++) {
		if (temp[i]) { 
			var key = temp[i].key;
			var value = temp[i].value;
			var hash = this.hash(key);
			if (this.table[hash]) { 
				var val = this.probe(hash);
				this.table[val] = {key, value};
			} else { 
				this.table[hash] = {key, value};
			}
		}
	}
}

$(".addButton").on("click", function(event) {
    event.preventDefault();
    $(".res").html("");
    if($("input[name=name1]").val() == "" || $("input[name=value]").val() == 0)  {
        alert("Введите хоть что-нибудь в ключе и значении для добавления");
        return;
    }
    ht.add($("input[name=name1]").val(), $("input[name=value]").val());
    updateTable();
    $('[name="add"] input:not([type="submit"])').val("");
});

function updateTable() {
    $(".hash tbody").empty();
    for(let el of Object.values(ht.table)) {
        $(".hash tbody").append("<tr>" + wrap(el.key) + wrap(el.value) + "</tr>");
    }
}

function wrap(value) {
    return "<td>" + value + "</td>";
};

$(".findButton").on("click", function(event) {
    event.preventDefault();
    if($("input[name=name2]").val() == "")  {
        alert("Введите хоть что-нибудь для поиска");
        return;
    }
    let text = $("input[name=name2]").val();
    let found = ht.get(text);
    if(found == undefined) $(".res").html("Элемент по ключу <b>" + text + "</b> не найден!");
    else $(".res").html("Элемент по ключу <b>" + text + "</b> имеет значение <b>" + found + "</b>")
    $('[name="find"] input:not([type="submit"])').val("");
});

$("table").on("click", function(e) {
    if (e.target.tagName != 'TH') return;
    let th = e.target;
    sortTable(this, th.cellIndex, th.dataset.type);
});

function sortTable(table, colNum, type) {
    let tbody = table.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);
    let compare;
    switch (type) {
        case 'number':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            };
            break;
        case 'string':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
            };
            break;
    }

    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}

$(".deleteButton").on("click", function(event) {
    event.preventDefault();
    $(".res").html("");
    if($("input[name=name3]").val() == "")  {
        alert("Введите хоть что-нибудь для удаления");
        return;
    }
    let text = $("input[name=name3]").val();
    ht.remove(text);
    $('[name="delete"] input:not([type="submit"])').val("");
    updateTable();
});

let ht = new hashTable(1103 * 2);

let ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

for(let i = 1; i <= ht.size / 2; i++) {
    let privateName = ID();
    ht.add(privateName, i);
}

updateTable();