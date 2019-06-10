/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

THREE.TrackballControls = function ( object, domElement ) {

	var scope = this;
	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3();

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_movePrev = new THREE.Vector2(),
	_moveCurr = new THREE.Vector2(),

	_lastAxis = new THREE.Vector3(),
	_lastAngle = 0,

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };


	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	var getMouseOnScreen = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnScreen( pageX, pageY ) {

			vector.set(
				( pageX - scope.screen.left ) / scope.screen.width,
				( pageY - scope.screen.top ) / scope.screen.height
			);

			
			return vector;

		};

	}() );

	var getMouseOnCircle = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnCircle( pageX, pageY ) {

			vector.set(
				( ( pageX - scope.screen.width * 0.5 - scope.screen.left ) / ( scope.screen.width * 0.5 ) ),
				( ( scope.screen.height + 2 * ( scope.screen.top - pageY ) ) / scope.screen.width ) // screen.width intentional
			);

			return vector;

		};

	}() );

	this.rotateCamera = ( function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			objectUpDirection = new THREE.Vector3(),
			objectSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function rotateCamera() {

			moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );
			angle = moveDirection.length();

			if ( angle ) {

				_eye.copy( scope.object.position ).sub( scope.target );

				eyeDirection.copy( _eye ).normalize();
				objectUpDirection.copy( scope.object.up ).normalize();
				objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();

				objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
				objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );

				moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );

				axis.crossVectors( moveDirection, _eye ).normalize();

				angle *= scope.rotateSpeed;
				quaternion.setFromAxisAngle( axis, angle );

				_eye.applyQuaternion( quaternion );
				scope.object.up.applyQuaternion( quaternion );

				_lastAxis.copy( axis );
				_lastAngle = angle;

			} else if ( ! scope.staticMoving && _lastAngle ) {

				_lastAngle *= Math.sqrt( 1.0 - scope.dynamicDampingFactor );
				_eye.copy( scope.object.position ).sub( scope.target );
				quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
				_eye.applyQuaternion( quaternion );
				scope.object.up.applyQuaternion( quaternion );

			}

			_movePrev.copy( _moveCurr );

		};

	}() );


	this.zoomCamera = function () {

	//console.log("zoom function");
		var factor;

		if ( _state === STATE.TOUCH_ZOOM_PAN ) {

			factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * scope.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( scope.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = ( function() {

		var mouseChange = new THREE.Vector2(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function panCamera() {

			mouseChange.copy( _panEnd ).sub( _panStart );
			
			
			if ( mouseChange.lengthSq() ) {

				
			
				mouseChange.multiplyScalar( _eye.length() * scope.panSpeed );

				pan.copy( _eye ).cross( scope.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( scope.object.up ).setLength( mouseChange.y ) );

				scope.object.position.add( pan );
				scope.target.add( pan );

				if ( scope.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( scope.dynamicDampingFactor ) );

				}

			}

		};

	}() );

	this.checkDistances = function () {

		if ( ! scope.noZoom || ! scope.noPan ) {
			
			if ( _eye.lengthSq() > scope.maxDistance * scope.maxDistance ) {

				scope.object.position.addVectors( scope.target, _eye.setLength( scope.maxDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

			if ( _eye.lengthSq() < scope.minDistance * scope.minDistance ) {
				
				
				scope.object.position.addVectors( scope.target, _eye.setLength( scope.minDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

		}

	};

	this.update = function () {

	
		_eye.subVectors( scope.object.position, scope.target );

		if ( ! scope.noRotate ) {

			scope.rotateCamera();

		}

		if ( ! scope.noZoom ) {

			scope.zoomCamera();

		}

		if ( ! scope.noPan ) {

			scope.panCamera();

		}

		scope.object.position.addVectors( scope.target, _eye );

		scope.checkDistances();

		scope.object.lookAt( scope.target );
		
		if ( lastPosition.distanceToSquared( scope.object.position ) > EPS ) {

			scope.dispatchEvent( changeEvent );

			lastPosition.copy( scope.object.position );

		}

	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		scope.target.copy( scope.target0 );
		scope.object.position.copy( scope.position0 );
		scope.object.up.copy( scope.up0 );

		_eye.subVectors( scope.object.position, scope.target );

		scope.object.lookAt( scope.target );

		scope.dispatchEvent( changeEvent );

		lastPosition.copy( scope.object.position );

	};
	this.getZoomScale = function() {

		return parseInt(16.0 * (Math.sqrt(_eye.lengthSq()) - this.minDistance ) / (this.maxDistance - this.minDistance));

	};
	
	this.setZoomScale = function(index){
		
	}; 
	// listeners

	function keydown( event ) {

		if ( scope.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		_prevState = _state;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === scope.keys[ STATE.ROTATE ] && ! scope.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === scope.keys[ STATE.ZOOM ] && ! scope.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === scope.keys[ STATE.PAN ] && ! scope.noPan ) {

			_state = STATE.PAN;

		}

	}

	function keyup( event ) {

		if ( scope.enabled === false ) return;

		_state = _prevState;

		//window.addEventListener( 'keydown', keydown, false );

	}

	function onMouseDown( event ) {

	
		if ( scope.enabled === false ) return;
		
		event.preventDefault();
		event.stopPropagation();

		//更新窗口大小，否则getScreenSize获得数据不准确
		scope.handleResize();

		
		//鼠标左键
		if ( _state === STATE.NONE && event.which == 1 ) {
        
			_state = event.button;
        
		}
        
		if ( _state === STATE.ROTATE && ! scope.noRotate ) {

			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrev.copy( _moveCurr );
			
			

		}
		else if ( _state === STATE.ZOOM && ! scope.noZoom ) {
			
			//return;
			//_zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			//_zoomEnd.copy( _zoomStart );
        
		} //else if ( _state === STATE.PAN && ! scope.noPan ) {
		
			
		if(!scope.noPan && event.which == 3){//right button
       
			_panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_panEnd.copy( _panStart );
			//ConsoleLog("mouse down pan");
			//ConsoleLog(_panStart);
		}
		
		scope.dispatchEvent( startEvent );
		
	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && ! scope.noRotate ) {

			_movePrev.copy( _moveCurr );
			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );

		} else if ( _state === STATE.ZOOM && ! scope.noZoom ) {

			_zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		} //else if ( _state === STATE.PAN && ! scope.noPan ) {
		if(!scope.noPan && event.which == 3){//right button
			//ConsoleLog("mouse move pan");
			_panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			//ConsoleLog(_panEnd);
		}
		scope.update();
	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		//document.removeEventListener( 'mousemove', mousemove );
		//document.removeEventListener( 'mouseup', mouseup );
		scope.dispatchEvent( endEvent );

	}

	function onMouseWheel( event ) {
		
		if ( scope.enabled === false ) return;
		
		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) {

			// WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) {

			// Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		scope.update();
		scope.dispatchEvent( startEvent );
		scope.dispatchEvent( endEvent );
		//console.log("mouse wheel");
	}

	function touchstart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

			default: // 2 or more
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

		}

		scope.dispatchEvent( startEvent );

	}

	function touchmove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy( _moveCurr );
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			default: // 2 or more
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				break;

		}

	}

	function touchend( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 0:
				_state = STATE.NONE;
				break;

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

		}

		scope.dispatchEvent( endEvent );

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousemove', onMouseMove, false );
	this.domElement.addEventListener( 'mouseup', onMouseUp, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	//window.addEventListener( 'keydown', keydown, false );
	//window.addEventListener( 'keyup', keyup, false );

	

	// force an update at start
	this.update();
	
	//it doesn't work
	this.handleResize();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;
