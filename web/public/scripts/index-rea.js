var chrono = {
	isStarted: false
 }
//walking observerable
var pressW = Rx.Observable.fromEvent(window, 'keydown')
	.filter(e => e.keyCode === "W")
	.filter(e => !e.repeat)   
	.partition(x => chrono.isStarted)

var releaseW = Rx.Observable.fromEvent(window, 'keyup')
	.filter(x => x.keyCode === "W")
	
var chronoStarted = pressW[0];
var chronoStopped = pressW[1];

var holdW = chronoStopped
	.flatMap(function(e) {
		return Rx.Observable
			.return(e)
			//.delay(500)
			.takeUntil(releaseW)
			.take(1)
	})

releaseW.subscribe(function(x) {
console.log('let go')
})


holdW.subscribe(function(x) {
	console.log('W')
})
