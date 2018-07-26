(function(){
	if(Hls.isSupported()){
		var video = document.getElementById('video');
		var levels = document.getElementById('levels');
		var hls = new Hls({debug: true});
		hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    	hls.attachMedia(video);

    	var switching = false;

    	hls.on(Hls.Events.MANIFEST_PARSED, function() {
    		createSwitchButtons();
    		hls.currentLevel = 0;
    	})

    	hls.on(Hls.Events.LEVEL_SWITCHING, function(evt, data){
    		switching = true;
    		console.log('==level_switching', hls.currentLevel, ' --> ' ,data.level);
    	});

    	hls.on(Hls.Events.LEVEL_SWITCHED, function(evt, data) {
    		console.log('==level_switched', hls.currentLevel, '===', data.level);
    		switching = false;
    	})

    	hls.on(Hls.Events.LEVEL_LOADING, function(evt, data) {
    		if(switching) {
    			console.log('==level-loading', hls.currentLevel)
    		}
    	})

    	hls.on(Hls.Events.FRAG_LOADED, function(evt, data) {
    		if(switching) {
    			console.log('==Frag-loaded', hls.currentLevel, data.level);
    		}
    	})

    	hls.on(Hls.Events.FRAG_CHANGED, function(evt, data) {
    		if(switching) {
    			console.log('==Frage---changed', hls.currentLevel, data);
    		}
    	})

        hls.on(Hls.Events.STREAM_STATE_TRANSITION, function(evt, data) {
            if(switching) {
                console.log('=== Trans', data)
            }
        })

    	hls.on(Hls.Events.LEVEL_LOADED, function(evt, data) {
    		if(switching) {
    			console.log('==level_loaded', hls.currentLevel);
    		}
    	})

        hls.on('nimabi', function (evt, msg){
            if(switching) {
                console.log('===nimabi', msg)
            }
        })

    	function createSwitchButtons() {
    		hls.levels.forEach(function(level, index){
    			var li = document.createElement('li');
    			li.innerText = level.name;
    			li.setAttribute('level-id', index);
    			levels.appendChild(li);
    		});

    		levels.addEventListener('click', function(e) {
    			var button = e.target;
    			if(button instanceof HTMLLIElement) {
    				var level = button.getAttribute('level-id') | 0;
    				console.log('==点击level:', hls.currentLevel, level);
    				hls.currentLevel = level;
    			}
    		})
    	}
	}
})()