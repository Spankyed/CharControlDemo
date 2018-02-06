var chrono = {
   isStarted: false
}

var releaseW = Rx.Observable.fromEvent(document.body, 'keyup')
	.filter(x => x.keyCode === 87)

var pressW = Rx.Observable.fromEvent(document.body, 'keydown')
	.filter(e => e.keyCode === 87)
	.filter(e => !e.repeat)
	.partition(x => chrono.isStarted)
	
var chronoStarted = pressW[0];
var chronoStopped = pressW[1];

var holdW = chronoStopped
	.flatMap(function(e) {
		return Rx.Observable
			.of(e)
			//.delay(500)
			.takeUntil(releaseW)
			.take(1)
	})

var intervalW = holdW.merge(releaseW)	
	.timeInterval()
	.filter((x, index) => index % 2) // only gets interval from keydown -> keyup
    .map(function (x) { return x; });

var actions	= [];
	
var subscription = intervalW.subscribe(
    function (x) {
        console.log(x);
		actions.push(x.interval);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });
	
	
// releaseW.subscribe(function(x) {
	// console.log('W let go')
// })


// holdW.subscribe(function(x) {
	// console.log('W pressed')
// })
