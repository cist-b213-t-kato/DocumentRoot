
var TeaTimeTable = function(id, json) {
	this.id = id;
	this.json = json;
	this.crt = new moment();
};

TeaTimeTable.prototype.whileUpdate = function(sec) {
	var inst = this;
	inst.update();
	setInterval(function() {
		inst.update();
	}, sec*1000);
}

TeaTimeTable.prototype.update = function() {

	this.crt = new moment();
	// var this.crt = new moment().add(1, 'days');
	//var this.crt = toDate('16:55');

	var table = $(this.id);
	table.empty();

	var thead = $("<thead>");
	thead.empty();
	var thr = $("<tr>");
	for ( var i in this.json.column ) {
		if ( this.json.columnVisible && !this.json.columnVisible[i] ) {
			continue;
		}
		var th = $("<th>");
		th.text(this.json.column[i]);
		thr.append(th);
	}
	thead.append(thr);
	table.append(thead);

	var tbody = $("<tbody>");

	tbody.empty();

	var list = this.json.times;

	var late = true;

	for ( var j in list ) {
    
		var tr = $("<tr>");

		var timeRow = list[j];

		var first = this.toDate(this.getFirst(timeRow));
		var last = this.toDate(this.getLast(timeRow));

		if ( late && this.crt <= first ) {
			tr.addClass("highlight");
			tr.addClass("large");
			late = false;
		}

		if ( this.crt >= first && this.crt <= last ) {
			tr.addClass("highlight");
		}

		for ( var i in timeRow ) {

			if ( this.json.columnVisible && !this.json.columnVisible[i] ) {
				continue;
			}

      var td = $("<td>");
			var t = timeRow[i];
			if ( !t || t == "" ) {
        td.text("-");
			} else {
				td.text(t);
			}

			if ( i == 0 && this.json["noriba"] && this.json["noriba"][j] == "2" ) {
				td.addClass("noriba2");
			}

			tr.append(td);
		}
		tbody.append(tr);
	}

	table.append(tbody);

}

// https://www.sejuku.net/blog/25316#Ajax

/**
 * HH:mm形式の時間を表す文字列をMomentオブジェクトで返す
 * @param tStr HH:mm形式の時間を表す文字列
 */
TeaTimeTable.prototype.toDate = function( tStr ) {
	var ret = moment();

	var h = Number(tStr.split(":")[0]); //( "00" + tStr ).substr(-5, 2);
	var m = Number(tStr.split(":")[1]); //( "00" + tStr ).substr(-2);

	ret.hours(h);
	ret.minute(m);
	ret.second(0);

	return ret;
}

TeaTimeTable.prototype.getFirst = function( times ) {
	for ( var i=0; i<times.length; i++ ) {
		if ( times[i] && times[i] != "" ) {
			return times[i];
		}
	}
	return ""; 
}

TeaTimeTable.prototype.getLast = function( times ) {
	for ( var i=times.length-1; i>=0; i-- ) {
		if ( times[i] && times[i] != "" ) {
			return times[i];
		}
	}
	return "";
}

