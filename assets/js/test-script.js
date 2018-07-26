/******************************************
*   Robert Koteles
*   Senior Web developer
*   July 2018
*   Javascript test
******************************************/


/*****************************
*  DATA MANAGEMENT FUNCTIONS
******************************/

let handleUserDatas = {
    initialize: function () {
        let self = this;
        
        let loadExternal = false;

        if ( loadExternal ) {
        	self.readExternalJSON();
        } else {
					data = self.readJSON();
					self.processData(data);
        }
        
    },
    readJSON: function () {
	    //
	    // Read data stored in JavaScript variable
	    // --------------------------------------------------------------------------
        let self = this;

        return JSON.parse(testJsonString);
    },
    readExternalJSON: function () {
    	//
	    // Read data stored in external JSON file
	    // --------------------------------------------------------------------------
    	let self = this,
    			requestURL = 'assets/json/test-data.json',
    			request = new XMLHttpRequest();
    	
    	// set the nature of request
    	request.open('GET', requestURL);
    	request.responseType = 'json';
			request.send();

			// when it's loaded from external, start processing
			request.onload = function() {
			  testJsonString = request.response;
			  self.processData(testJsonString);
			}

    },
    processData: function (jsonObj) {
    	//
	    // Processing data coming from JSON object. 
	    // --------------------------------------------------------------------------
    	let self = this;

    	metaDatas = jsonObj.users.metaData;
    	metricDatas = jsonObj.users.metricData;
			outputArray = self.sortingData(metaDatas.map(self.populateData), 5, sortDirection, 'numeric');
			
			// building the header first
			manipulateDom.buildHeader();

			// building the other rows
			outputArray.map(manipulateDom.appendToDom);

    },
    sortingData: function ( elements, index, direction, type ) {
    	//
	    // Sorting data array. 
	    // If direction is -1, it will be descending. If it's +1 it will be ascending
	    // Sorted by type of data: numericaly or alphabeticaly
	    // --------------------------------------------------------------------------

    	if ( type === 'numeric' ) {
    		// numeric
    		return elements.sort(function(x,y){return (x[index]-y[index])*direction });	
    	} else { 
    		// alphabeticaly
    		return elements.sort(function(x,y) {
	    		let A = x[0];
			    let B = y[0]; 
			    let res = 0; 

			    if (A < B) res = -1;
			    if (A > B) res = 1;
			   
    			return res*direction;
    		});

    	}
    	
    },
    populateData: function ( element, index ) {
    	//
	    // Populating data coming from JSON object. 
	    // --------------------------------------------------------------------------
    	let self = this;
    	
    	// filtering the belonging row
    	let userActivity = metricDatas.filter(function (metricDataItem) { return metricDataItem.id == element.id });
   		
   		/* format date
   		let convertedDate = new Date( element.created_at );
   		*/

   		// this array contains all required data that task asked for
			var resultArr = [ 
												element.id, 
												element.username, 
												element.email, 
												userActivity[0].comment_count, 
												userActivity[0].like_count,
												Math.round( (userActivity[0].like_count / userActivity[0].login_count) * 100 ) / 100,
												element.created_at
							    		];

			return resultArr;
    },
    
};


/*****************************
*  DOM MANIPULATOR FUNCTIONS
******************************/

let manipulateDom = {
		buildHeader: function () {
			let self = this,
					headerLabels;

			// labels displaying as first row
			headerLabels = [
							    		'ID', 
							    		'Username', 
							    		'Email', 
							    		'Comment count', 
							    		'Like count', 
							    		'Like count per login', 
							    		'Created at'
							    		];
			// remove loading animation
			loadToSection.innerHTML = '';

			// append header labels to DOM 
 	  	self.appendToDom(headerLabels, 'table-header');

		},
    appendToDom: function ( datas, index ) {
    	//
	    // Adding data into DOM
	    // --------------------------------------------------------------------------
 			
 			let newParentDiv = document.createElement('div');
 			newParentDiv.classList.add('row-' + index);

 	  	datas.map(function(element, index) { 

				let newChild = document.createElement('span');
				newChild.classList.add('col-' + index);
				newChild.textContent = element;

				// adding this new data to the dinamically created DIV parent
				newParentDiv.appendChild(newChild);
			});

 	  	// adding the entire row to DOM
			loadToSection.appendChild(newParentDiv);
    },
    duplicateContent: function () {
    	//
	    // Just for testing purposes: this function duplicates the result data table 
	    // to show another responsive layout on mobile.
	    // --------------------------------------------------------------------------
    	document.getElementById('test-data-2').innerHTML = document.getElementById('test-data').innerHTML;
    },
    initEvents: function () {
    	//
	    // Sorting functions, event fired by clicking on header labels.
	    // --------------------------------------------------------------------------
    	// it's not the part of the task but it could be essential to define the click event on header labels to set sorting by the proper value ASC/DESC

    	let elements = document.getElementsByClassName("row-table-header");

    	for (let i = 0; i < elements.length; i++) {

    			for (let j = 0; j < elements[i].childNodes.length; j++) {
    				elements[i].childNodes[j].addEventListener("click", function() { 
				    	// ==========================================================================
				    	// Idea: after clicking on the table we've got the classname like col-1 
				    	// that is so easy to get the column number from (split). 
				    	// We also store the direction of the current sorting 
				    	// (for example in a variable or in data attribute)
				    	// After clicking on it we need to call a sorting function like this:
				    	// handleUserDatas.sortingData([ARRAY], 5, -1); 
				    	// Where array could be the ready to use array (outputArray).
				    	// After sorting the array we just need to build the new DOM after
				    	// make the test-data container empty.
				    	// Simple.
				    	// ==========================================================================
				    	
				    	// get column's number
				    	let classList = this.classList[0];
				    	let colNumber = classList.split("-");

				    	// type of sorting
				    	sortingType = 'alphabeticaly';

				    	if ( [0, 3, 4, 5].indexOf(j) > -1 ) {
				    		sortingType = 'numeric';
				    	} 
				    	
				    	// chaning the direction to opposite as it was before
				    	sortDirection *= -1;

				    	// sorting data
				    	outputArray = handleUserDatas.sortingData(outputArray, colNumber[1], sortDirection, sortingType);

				    	// we have the sorted Array
				    	console.log( outputArray );

				    	// erase previous DOM part
				    	loadToSection.innerHTML = '';

				    	// building the header first
							manipulateDom.buildHeader();

							// building the other rows
							outputArray.map(manipulateDom.appendToDom);

							// JUST FOR TESTIN PURPOSES: duplicate the result into the second container
							manipulateDom.duplicateContent();

							// init click events again (as previous elements gone)
							manipulateDom.initEvents();

				    });
					}

			}

    }
};


/*********************
*  LOADER
*********************/

var metaDatas,
		metricDatas,
		loadToSection = document.getElementById('test-data'),
		outputArray,
		sortDirection = -1;

window.onload = function () {
    'use strict';

    handleUserDatas.initialize();
    manipulateDom.duplicateContent();
    manipulateDom.initEvents();
}