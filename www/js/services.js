var scifest = angular.module('scifest', []);

scifest.service('workshopService', function() {
	this.workshopData = null;

	this.getWorkshopData = function() {
		return this.workshopData;
	}

	this.setWorkshopData = function(workshopData) {
		this.workshopData = workshopData;
	}
})

scifest.service('summaryService', function() {
	this.completedAssignments = [];

	this.addCompletedAssignment = function(assignment) {
		this.completedAssignment.push(assignment);
	}
})