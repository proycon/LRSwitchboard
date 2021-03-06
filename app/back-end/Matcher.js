// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Matcher.js
// Time-stamp: <2018-03-09 09:53:10 (zinn)>
// -------------------------------------------

import React, { Component } from 'react';
import uuid from 'node-uuid';
import Registry from './Registry.js';

export default class Matcher {

    constructor() {
	this.registeredTools = Registry;
    }

    // construct a dictionary to group all tools in terms of the tasks they can perform
    // key: task, value: tools
    groupTools( tools ){

	var toolGroups = {};

	for (var i = 0; i<tools.length; i++) {
	    const entry = tools[i];
	    const toolInfo = [ {
		name            : entry.name,
		logo            : entry.logo,
		description     : entry.description,
		homepage        : entry.homepage,
		url             : entry.url,
		location        : entry.location,
		authentication  : entry.authentication,
		id              : entry.id,
		email           : entry.contact.email,
		parameters      : entry.parameters,
		langEncoding    : entry.langEncoding,
		output          : entry.output,
		softwareType    : entry.softwareType,
		requestType     : entry.requestType,
		mapping         : entry.mapping,
	    } ];

	    if (entry.task in toolGroups) {
		toolGroups[ entry.task ] = toolGroups[ entry.task ].concat( toolInfo );
	    } else {
		toolGroups[ entry.task ] = [].concat( toolInfo );		
	    }
	}
	return toolGroups;
    }

    // return all tools (and web services) of the registry
    // parameter indicates whether web services should be included
    allTools( includeWebServices ) {

	var tools = [];

	// get rid of web services if required
	if (includeWebServices === true) {
	    tools = this.registeredTools;
	} else {
	    tools = this.registeredTools.filter(
		(tool) =>
		    {
			if (! (tool.softwareType == "webService")) {
			    tool.id = uuid.v4();
			    return tool;
			}
		    });
	}
	
	var toolsPerTask = this.groupTools( tools );

	// should never happen, implies empty tool registry
	// CZ: should be dealt with in the React component (rendering task-oriented list)	
	if (Object.keys(toolsPerTask).length == 0) {
	    alert("Sorry! The app registry has no tool entries");
	}

	return toolsPerTask;
    }
    
    // multiple filters to be defined, in particular, language code
    findApplicableTools( resourceDescription, includeWebServices) {

//	console.log('Matcher.js/findApplicableTools', resourceDescription, includeWebServices) ;
	// if necessary, filter out web services
	var tools = [];

	// in case web services all excluded, filter out all web services from result list.
	if (includeWebServices === true) {
	    tools = this.registeredTools;
	} else {
	    tools = this.registeredTools.filter(
		(tool) =>
		    {
			if (! (tool.softwareType == "webService")) {
			    tool.id = uuid.v4();
			    return tool;
			}
		    });
	}
	
	// first filter: mimetype
	var mimetypeFilter = tools.filter(
	    (tool) =>
		{
		    var result = tool.mimetypes.indexOf(resourceDescription.mimetype);
		    if (result != -1) {
			// attach id to the tool
			tool.id = uuid.v4();
			return tool;
		    }
		});

	var languageFilter = [];
	
	// second filter: language code 
	if ( (resourceDescription.language == null) || (resourceDescription.language.length == 0)) {
	    console.log('Matcher/findApplicableTools: empty language', resourceDescription.language); 
	} else {
	    languageFilter = mimetypeFilter.filter(
		(tool) =>
		    {
			var result = tool.languages.indexOf(resourceDescription.language.threeLetterCode);
			if (result != -1) {
			    // attach id to the tool
			    tool.id = uuid.v4();
			    return tool;
			}
			
			// for tools that are capable for processing any language
			result = tool.languages.indexOf("generic");
			if (result != -1) {
			    // attach id to the tool
			    tool.id = uuid.v4();
			    return tool;
			}
		    });
	}

	// --------------------------------	
	// additional filters coming here..
	// --------------------------------

	// now, for the task-oriented view
	var toolsPerTask = this.groupTools( languageFilter );

	// CZ: should be dealt with in the React component (rendering task-oriented list)
	if (Object.keys(toolsPerTask).length == 0) {
	    if (includeWebServices === true) {
		alert("The switchboard has no tools or web services registered that can process your resource!");
	    } else {
		alert("The switchboard has no tools registered that can process your resource! Please try enabling Web Services to check whether there is a web service that can process your resource.");
	    }
	}

	return toolsPerTask;
    }
}
